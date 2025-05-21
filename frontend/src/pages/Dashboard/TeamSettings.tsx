import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { RECYCLINK_ADDRESS, RECYCLINKABI } from '../../constants';
import { useWasteWiseContext } from '../../context';
import { toast } from 'sonner';
import { Button, Card, CardBody, CardHeader, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { FaUsers, FaUserPlus, FaTrash, FaCrown } from 'react-icons/fa';

interface TeamMember {
  address: string;
  name: string;
  role: 'leader' | 'member';
  joinedAt: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  leader: string;
  members: TeamMember[];
  totalRecycled: number;
  createdAt: string;
}

const TeamSettings = () => {
  const { address } = useAccount();
  const { currentUser } = useWasteWiseContext();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Fetch user's teams
  const { data: userTeams, isSuccess: gotTeams } = useReadContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "getUserTeams",
    account: address,
  });

  // Create team function
  const { writeContract } = useWriteContract({
    address: RECYCLINK_ADDRESS,
    abi: RECYCLINKABI,
    functionName: "createTeam",
  });

  useEffect(() => {
    if (gotTeams && userTeams) {
      // Process team data
      const processedTeams = (userTeams as any[]).map((team: any) => ({
        id: team.id,
        name: team.name,
        description: team.description,
        leader: team.leader,
        members: team.members.map((member: any) => ({
          address: member.address,
          name: member.name,
          role: member.address === team.leader ? 'leader' : 'member',
          joinedAt: new Date(Number(member.joinedAt) * 1000).toLocaleDateString(),
        })),
        totalRecycled: Number(team.totalRecycled),
        createdAt: new Date(Number(team.createdAt) * 1000).toLocaleDateString(),
      }));
      setTeams(processedTeams);
      setIsLoading(false);
    }
  }, [gotTeams, userTeams]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    try {
      await writeContract({
        address: RECYCLINK_ADDRESS,
        abi: RECYCLINKABI,
        functionName: "createTeam",
        args: [newTeamName, newTeamDescription],
      });
      toast.success('Team created successfully!');
      onClose();
      setNewTeamName('');
      setNewTeamDescription('');
    } catch (error) {
      toast.error('Failed to create team');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <FaUsers className="text-[#983279]" />
            Team Settings
          </h1>
          <Button
            color="primary"
            startContent={<FaUserPlus />}
            onClick={onOpen}
            className="bg-[#983279] hover:bg-[#983279]/90 text-white"
          >
            Create New Team
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="bg-background border border-[#983279]/20">
              <CardHeader className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{team.name}</h3>
                  <p className="text-sm text-foreground/60">Created: {team.createdAt}</p>
                </div>
                {team.leader === address && (
                  <FaCrown className="text-[#983279]" />
                )}
              </CardHeader>
              <CardBody>
                <p className="text-sm mb-4 text-foreground/80">{team.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/80">Total Recycled:</span>
                    <span className="font-semibold text-[#983279]">{team.totalRecycled} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/80">Members:</span>
                    <span className="font-semibold text-[#983279]">{team.members.length}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2 text-foreground">Team Members:</h4>
                  <div className="space-y-1">
                    {team.members.map((member) => (
                      <div
                        key={member.address}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-foreground/80">{member.name || member.address.slice(0, 6)}...</span>
                        <span className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: member.role === 'leader' ? '#983279' : '#98327920',
                            color: member.role === 'leader' ? 'white' : '#983279'
                          }}
                        >
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Create Team Modal */}
        <Modal isOpen={isOpen} onClose={onClose} classNames={{
          backdrop: "bg-background/50 backdrop-opacity-40",
          base: "bg-background text-foreground",
          header: "text-foreground",
          body: "text-foreground",
          footer: "text-foreground"
        }}>
          <ModalContent>
            <ModalHeader>Create New Team</ModalHeader>
            <ModalBody>
              <Input
                label="Team Name"
                placeholder="Enter team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground"
                }}
              />
              <Input
                label="Description"
                placeholder="Enter team description"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
                classNames={{
                  label: "text-foreground",
                  input: "text-foreground"
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleCreateTeam}
                className="bg-[#983279] hover:bg-[#983279]/90 text-white"
              >
                Create Team
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default TeamSettings; 