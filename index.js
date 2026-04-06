require("dotenv").config();
const noblox = require("noblox.js");

const groupId = Number(process.env.GROUP_ID);
const targetRank = Number(process.env.TARGET_RANK);

let rankedUsers = new Set(); // prevents duplicate ranking

async function startBot() {
    await noblox.setCookie(process.env.ROBLOX_COOKIE);
    console.log("✅ Logged into Roblox bot");

    // get role info (optional but useful)
    const roles = await noblox.getRoles(groupId);
    console.log("📊 Roles loaded");

    setInterval(async () => {
        try {
            const members = await noblox.getPlayers(groupId);

            for (let user of members) {
                // If user has NO rank (guest role / lowest)
                if (user.role.rank === 0 && !rankedUsers.has(user.userId)) {

                    await noblox.setRank(groupId, user.userId, targetRank);

                    rankedUsers.add(user.userId);

                    console.log(`✅ Ranked ${user.username}`);
                }
            }

        } catch (err) {
            console.error("❌ Error:", err.message);
        }
    }, 15000); // every 15 seconds
}

startBot();
