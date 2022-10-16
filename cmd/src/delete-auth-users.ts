import { deleteAuthUsers, getAuthUsers } from "./firestore";

(async () => {
  try {
    const users = (await getAuthUsers()).users;
    console.log(`users len: ${users.length}`);

    const res = await deleteAuthUsers(users.map((user) => user.uid));
    console.log(`succeeded: ${res.successCount}, failed: ${res.failureCount}`);
  } catch (err) {
    console.error("error: " + err);
  }
})();
