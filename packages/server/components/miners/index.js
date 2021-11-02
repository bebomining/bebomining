const { createMiner } = require("./createMiner");

const xmrigConfig = require("./configs/xmrig.json");
const { xmrig: minerXmrig } = require("./xmrig");
const xmrig = createMiner(xmrigConfig, minerXmrig);

const lolminerConfig = require("./configs/lolminer.json");
const { lolminer: minerLolMiner } = require("./lolminer");
const lolminer = createMiner(lolminerConfig, minerLolMiner);

const trexConfig = require("./configs/trex.json");
const { trex: minerTrex } = require("./trex");
const trex = createMiner(trexConfig, minerTrex);

const teamredminerConfig = require("./configs/teamredminer.json");
const { teamredminer: minerTeamredminer } = require("./teamredminer");
const teamredminer = createMiner(teamredminerConfig, minerTeamredminer);

const minerNBminerConfig = require("./configs/nbminer.json");
const { nbminer: minerNBminer } = require("./nbminer");
const nbminer = createMiner(minerNBminerConfig, minerNBminer);

module.exports = { xmrig, lolminer, trex, teamredminer, nbminer };
