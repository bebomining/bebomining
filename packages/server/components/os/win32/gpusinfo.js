const util = require("util");
const exec = util.promisify(require("child_process").exec);
const Joi = require("joi");

const csv = require("csvtojson");

const gpusinfo = () => ({
  async gpusinfo() {
    const cmd = `wmic path win32_VideoController get Name,DeviceID,VideoProcessor /FORMAT:CSV`;
    const { stdout, stderr } = await exec(cmd);

    if (stderr) {
      throw new Error(stderr);
    }

    const gpusList = await csv({ noheader: false }).fromString(stdout.trim());

    const promises = gpusList.map(
      async ({
        DeviceID: deviceid,
        Name: name,
        VideoProcessor: videoProcessor
      }) => {
        const cmd = `(gwmi win32_VideoController -Filter 'DeviceID like "${deviceid}%"').GetRelated('Win32_PnPEntity').GetRelated('Win32_Bus') | ConvertTo-Csv -NoTypeInformation`;
        const { stdout, stderr } = await exec(cmd, { shell: "powershell.exe" });
        if (stderr) {
          throw new Error(stderr);
        }
        const info = await csv({ noheader: false }).fromString(stdout.trim());
        const { BusNum } = info[0];
        const gpu = {
          busNum: parseInt(BusNum),
          deviceid,
          name,
          videoProcessor
        };
        Joi.assert(gpu, gpuValidation);
        return gpu;
      }
    );

    const listGPUs = await Promise.all(promises);

    return listGPUs.sort((a, b) => a.busNum - b.busNum);
  }
});

exports.gpusinfo = gpusinfo;

const gpuValidation = Joi.object({
  busNum: Joi.number().required(),
  deviceid: Joi.string().required(),
  name: Joi.string().required(),
  videoProcessor: Joi.string().required()
});
