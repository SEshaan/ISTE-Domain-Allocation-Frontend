import AdminDomains from ".";
import AdminInterviews from "./interview";
import AdminQuestionnaire from "./questionare/AdminQuestionnaire";
import AdminResponses from "./Responses";
import AdminSubmissions from "./Submissions";
import AdminTasks from "./Tasks";
import AdminUsers from "./Users";
import AdminWhitelistedUsers from "./whitelist";

export default function Dashboard() {
  return (
    <div className="p-6">
      <AdminDomains />
      <AdminUsers />
      <AdminInterviews />
      <AdminQuestionnaire />
      {/* <AdminResponses /> */}
      <AdminTasks />
      <AdminSubmissions />
      <AdminResponses />
      <AdminWhitelistedUsers />
    </div>
  );
}
