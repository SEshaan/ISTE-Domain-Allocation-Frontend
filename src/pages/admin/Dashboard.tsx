import AdminDomains from ".";
import AdminInterviews from "./interview";
import AdminQuestionnaire from "./Questions";
import AdminUsers from "./Users";
import AdminWhitelistedUsers from "./whitelist";

export default function Dashboard() {
  return (
    <div className="p-6">
      <AdminDomains />
      <AdminUsers />
      <AdminInterviews/>
      <AdminQuestionnaire />
      <AdminWhitelistedUsers />
    </div>
  );
}
