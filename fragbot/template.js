/*
    Fragbots 101
        if chat message is equal to party invite message
        join party
        wait a bit
        leave party
*/

/*
    register("chat", (player) => {
        // Add a player whitelist so that only people wanted can join

        new Thread(() => {
            ChatLib.command("p accept " + player.replace(/\[[\w+\+-]+] /, "").replace("->newLine<-", "")); // Joining the party
            Thread.sleep(5000);
            ChatLib.command("p leave");
        }).start();
    }).setCriteria("-----------------------------${player} has invited you to join their party!${*}"); // Party invite message
*/
