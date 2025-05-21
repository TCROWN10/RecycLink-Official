import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Input, Button, Textarea, Select, SelectItem } from '@nextui-org/react';
import { FaBuilding, FaFileUpload, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'sonner';

interface CompanyFormData {
  companyName: string;
  registrationNumber: string;
  businessType: string;
  recyclingType: string[];
  address: string;
  contactEmail: string;
  phoneNumber: string;
  description: string;
  documents: File[];
}

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: '',
    registrationNumber: '',
    businessType: '',
    recyclingType: [],
    address: '',
    contactEmail: '',
    phoneNumber: '',
    description: '',
    documents: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically make an API call to register the company
      // and verify their documents
      
      toast.success('Registration submitted successfully!');
      navigate('/dashboard/company');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        documents: Array.from(e.target.files),
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-background border border-[#983279]/20">
          <CardHeader className="flex items-center gap-2">
            <FaBuilding className="text-[#983279]" />
            <h1 className="text-2xl font-bold text-foreground">Company Registration</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  className="text-foreground"
                />
                <Input
                  label="Registration Number"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  required
                  className="text-foreground"
                />
                <Select
                  label="Business Type"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  required
                  className="text-foreground"
                >
                  <SelectItem key="recycling" value="recycling">Recycling Company</SelectItem>
                  <SelectItem key="waste_management" value="waste_management">Waste Management</SelectItem>
                  <SelectItem key="environmental" value="environmental">Environmental Services</SelectItem>
                </Select>
                <Select
                  label="Recycling Type"
                  selectionMode="multiple"
                  value={formData.recyclingType}
                  onChange={(e) => setFormData({ ...formData, recyclingType: e.target.value })}
                  required
                  className="text-foreground"
                >
                  <SelectItem key="plastic" value="plastic">Plastic</SelectItem>
                  <SelectItem key="carbon" value="carbon">Carbon Credits</SelectItem>
                  <SelectItem key="paper" value="paper">Paper</SelectItem>
                  <SelectItem key="metal" value="metal">Metal</SelectItem>
                </Select>
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="text-foreground"
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                  className="text-foreground"
                />
                <Input
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                  className="text-foreground"
                />
              </div>

              <Textarea
                label="Company Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="text-foreground"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Required Documents
                </label>
                <div className="border-2 border-dashed border-[#983279]/20 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="document-upload"
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FaFileUpload className="text-2xl text-[#983279]" />
                    <span className="text-sm text-foreground/60">
                      Upload business registration, environmental permits, and other relevant documents
                    </span>
                  </label>
                </div>
                {formData.documents.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <FaCheckCircle className="text-[#983279]" />
                    {formData.documents.length} file(s) selected
                  </div>
                )}
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full bg-[#983279] hover:bg-[#983279]/90 text-foreground"
                isLoading={isLoading}
              >
                Submit Registration
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CompanyRegister; 