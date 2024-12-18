import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
  Input,
  Button
} from "@material-tailwind/react";
import {
  InformationCircleIcon,
  AdjustmentsVerticalIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState } from "react";
import { ProfileInfoCard } from "@/widgets/cards";
import { useAuth } from "@/context/AuthContext";
import UpdateProfile from "@/components/UpdateProfile";
import axios from "axios";
import { toast } from "react-toastify";

export function Profile() {
  const { currentUser } = useAuth();
  const user = currentUser?.user_metadata;

  const [activeTab, setActiveTab] = useState("info");
  const [isupdateOpen, setupdateOpen] = useState(false);
  const [startTime, setStartTime] = useState(""); // Start time state
  const [endTime, setEndTime] = useState(""); // End time state

  const handleInitialize = async () => {
    if (!startTime || !endTime) {
      toast.error("Start Time and End Time are required!");
      return;
    }

    try {
      const response = await axios.post(
        "/api/v1/initialize-cron",
        { startTime, endTime },
        {
          headers: {
            "x-tenant-id": currentUser?.id, // Include tenant ID from auth context
          },
        }
      );

      if (response.status === 200) {
        toast.success("Schedule initialized successfully!");
      } else {
        toast.error("Failed to initialize schedule");
      }
    } catch (error) {
      console.error("Error initializing schedule:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const toggleUpdateModal = () => setupdateOpen(!isupdateOpen);

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/bg-signup.jpg')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          {/* Header Section */}
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={user && user.profile || `/img/no-profile.jpg`}
                alt={user?.displayName || currentUser.email}
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {user?.displayName || currentUser.email}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Owner
                </Typography>
              </div>
            </div>
            <div className="w-96 items-center">
              <Tabs value={activeTab}>
                <TabsHeader>
                  <Tab value="info" onClick={() => setActiveTab("info")}>
                    <InformationCircleIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Info
                  </Tab>
                  <Tab value="metrics" onClick={() => setActiveTab("metrics")}>
                    <AdjustmentsVerticalIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Metrics
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>

          {/* Animated Sections */}
          <div className="relative h-64 overflow-hidden max-w-sm">
            <motion.div
              className="flex max-w-sm h-full gap-4"
              initial={{ x: activeTab === "info" ? "0%" : "-100%", opacity: 0 }}
              animate={{ x: activeTab === "info" ? "0%" : "-100%", opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Info Section */}
              <motion.div className="w-full flex-shrink-0">
                <ProfileInfoCard
                  title="Profile Information"
                  details={{
                    "School mobile": `+${user.phone}`,
                    "School email": `${currentUser.email}`,
                  }}
                  action={
                    <Tooltip content="Edit Profile">
                      <PencilIcon
                        className="h-4 w-4 cursor-pointer text-blue-gray-500"
                        onClick={toggleUpdateModal}
                      />
                    </Tooltip>
                  }
                />
              </motion.div>

              {/* Metrics Section */}
              <motion.div className="w-full flex-shrink-0">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Metrics
                </Typography>
                <div className="flex flex-col gap-4 w-5/6 md:w-3/4">
                  <Input
                    type="time"
                    label="Start Time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="08:00 AM" // Default placeholder
                  />
                  <Input
                    type="time"
                    label="End Time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="04:00 PM" // Default placeholder
                  />
                  <Button
                    color="light-blue"
                    onClick={handleInitialize}
                    className="self-start"
                  >
                    Initialize
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </CardBody>
      </Card>

      {isupdateOpen && (
        <UpdateProfile
          onClose={() => setupdateOpen(false)}
          isOpen={isupdateOpen}
        />
      )}
    </>
  );
}

export default Profile;

