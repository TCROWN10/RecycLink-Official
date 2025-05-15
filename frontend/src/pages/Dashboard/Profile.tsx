import React, { useEffect, useState, useRef } from "react";
import { useContractWrite, useAccount } from "wagmi";
import { BaseError } from "viem";
import Button from "../../components/Button";
import { useWasteWiseContext } from "../../context";
import { formatDate } from "../../utils";
import { RECYCLINK_ADDRESS, RECYCLINKABI } from "../../constants";
import { toast } from "sonner";
import useNotificationCount from "../../hooks/useNotificationCount";
import { useNavigate } from "react-router-dom";
import { CountryDropdown } from "react-country-region-selector";
import { FaRecycle } from "react-icons/fa";

interface UserProfileData {
  name: string;
  email: string;
  phoneNo: string;
  country: string;
  gender: number;
  profileImage: string;
  userAddr: string;
}

interface UserProfileContractData {
  name: string;
  email: string;
  phoneNo: bigint;
  country: string;
  gender: number;
  profileImage: string;
  userAddr: `0x${string}`;
}

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'detc4yjdi';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
const CLOUDINARY_UPLOAD_PRESET = 'recyclink_default';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, setNotifCount, wastewiseStore } = useWasteWiseContext();
  const notificationCount = useNotificationCount();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address } = useAccount();
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<UserProfileData>({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phoneNo: currentUser?.phoneNo?.toString() || "",
    country: currentUser?.country || "",
    gender: currentUser?.gender || 0,
    profileImage: currentUser?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${address}`,
    userAddr: currentUser?.userAddr || address || ""
  });

  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);

  const { write, isLoading: isUpdating } = useContractWrite({
    address: RECYCLINK_ADDRESS as `0x${string}`,
    abi: RECYCLINKABI,
    functionName: "editUser",
    args: undefined,
    onSuccess(data: any) {
      console.log('Transaction submitted:', data);
      toast.success('Profile update transaction submitted!');
    },
    onError(error: BaseError) {
      console.error('Contract error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  });

  useEffect(() => {
    // Initialize form data when currentUser or address changes
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phoneNo: currentUser.phoneNo?.toString() || "",
        country: currentUser.country || "",
        gender: currentUser.gender || 0,
        profileImage: currentUser.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${address}`,
        userAddr: currentUser.userAddr || address || ""
      });
    }
  }, [currentUser, address]);

  const validateImageFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
    }
    
    // 5MB limit
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 5MB.');
    }
    
    return true;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Validate file
      validateImageFile(file);

      setIsUploading(true);
      const toastId = toast.loading('Uploading image...');

      // Create form data for unsigned upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      // Upload to Cloudinary
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      // Update form data with new image URL
      setFormData(prev => ({ ...prev, profileImage: imageUrl }));

      // Create the profile data object with the correct types
      const profileData: UserProfileContractData = {
        name: formData.name,
        email: formData.email,
        phoneNo: BigInt(formData.phoneNo || '0'),
        country: formData.country,
        gender: Number(formData.gender),
        profileImage: imageUrl,
        userAddr: address as `0x${string}`
      };

      // Call the write function with the prepared data
      if (!write) {
        throw new Error('Contract write function not initialized');
      }

      write({
        args: [profileData],
      });

      toast.success('Please confirm the transaction in your wallet', {
        id: toastId,
        duration: 5000
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(value));
  }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailValid) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const toastId = toast.loading('Preparing to update profile...');

      // Create the profile data object with the correct types
      const profileData: UserProfileContractData = {
        name: formData.name,
        email: formData.email,
        phoneNo: BigInt(formData.phoneNo || '0'),
        country: formData.country,
        gender: Number(formData.gender),
        profileImage: formData.profileImage,
        userAddr: address as `0x${string}`
      };

      // Call the write function with the prepared data
      if (!write) {
        throw new Error('Contract write function not initialized');
      }

      write({
        args: [profileData],
      });

      toast.success('Please confirm the transaction in your wallet', {
        id: toastId,
        duration: 5000
      });
      
      // Update notification count after successful write initiation
      wastewiseStore.setItem(Date.now().toString(), {
        id: Date.now(),
        title: 'Profile Update Initiated',
        datetime: new Date(),
        type: 'info',
        message: 'Please confirm the transaction in your wallet'
      }).then(() => {
        setNotifCount(notificationCount + 1);
      });

    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <section className="relative w-full px-4 py-4 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Profile Image Section */}
        <div className="w-full lg:w-4/12 mb-8 lg:mb-0">
          <div className="bg-base-200 rounded-xl p-6">
            <div className="relative w-48 h-48 mx-auto">
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover ring-2 ring-primary"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full hover:bg-primary-focus transition-colors disabled:bg-gray-400"
              >
                {isUploading ? (
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
                />
              </div>
            
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold">{formData.name}</h2>
              <p className="text-sm text-gray-500">Member since: {formatDate(Number(currentUser?.timeJoined))}</p>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="w-full lg:w-8/12">
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-6">Profile Information</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full ${!isEmailValid ? 'input-error' : ''}`}
                  />
          </div>

                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
            </div>
                
            <div>
                  <label className="label">Country</label>
                  <CountryDropdown
                    value={formData.country}
                    onChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
                    classes="select select-bordered w-full"
                  />
            </div>
                
            <div>
                  <label className="label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value={0}>Female</option>
                    <option value={1}>Male</option>
                  </select>
            </div>
          </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!isEmailValid || isUpdating}
                  className="btn btn-primary"
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="stat bg-base-200 rounded-xl">
              <div className="stat-figure text-primary">
                <FaRecycle className="w-6 h-6" />
              </div>
              <div className="stat-title">Total Recycled</div>
              <div className="stat-value">{currentUser?.totalRecycled || 0}</div>
              <div className="stat-desc">↗︎ 400 (22%)</div>
            </div>

            <div className="stat bg-base-200 rounded-xl">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className="stat-title">Tokens Earned</div>
              <div className="stat-value">{currentUser?.tokenBalance || 0}</div>
              <div className="stat-desc">↗︎ 90 (14%)</div>
            </div>

            <div className="stat bg-base-200 rounded-xl">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </div>
              <div className="stat-title">Rank</div>
              <div className="stat-value">{currentUser?.rank || 'Novice'}</div>
              <div className="stat-desc">↗︎ Level 2</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
