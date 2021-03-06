<h3 align="center">An easy way to mine your preferred crypto coin.</h3><br/>

https://user-images.githubusercontent.com/87696149/135662791-d94abbb1-3caf-4c3d-9387-d15bf3b8d310.mp4

## :bulb: What is BeBoMining about?

Welcome! 👋 BeBoMining is an open source FREE software which simplifies the mining of your beloved crypto currencies. It supports multiple pools as well as multiple miner softwares such as [T-Rex](https://github.com/trexminer/T-Rex), [lolMiner](https://github.com/Lolliedieb/lolMiner-releases), [Teamredminer](https://github.com/todxx/teamredminer), [NBMiner](https://github.com/NebuTech/NBMiner) and [Xmrig](https://github.com/xmrig/xmrig).

It comes out of the box with:

👉🏻 Zero manual configurations of the mining software.<br/>
👉🏻 Zero manual configurations of the pool settings.<br/>
👉🏻 Remote control and monitoring of your rig with your mobile/desktop device. No need to install any app.<br/>
👉🏻 No Registration required.<br/>
👉🏻 Mining multiple coins on the same rig on different pool.<br/>

It does not store any data such as wallet addresses or any other info on the cloud. Data is only stored on your local machine.

Download is available in the [github releases section](https://github.com/bebomining/bebomining/releases).

## OS supported
- Windows 10

## Pools supported
- [Ethermine](https://ethermine.org/)
- [Ezil](https://ezil.me/)
- [Flexpool](https://www.flexpool.io/)
- [Unmineable](https://unmineable.com/)

## Miner Tools supported
- [lolMiner](https://github.com/Lolliedieb/lolMiner-releases)
- [NBMiner](https://github.com/NebuTech/NBMiner)
- [T-Rex](https://github.com/trexminer/T-Rex)
- [Teamredminer](https://github.com/todxx/teamredminer)
- [Xmrig](https://github.com/xmrig/xmrig)

## Antivirus alerts
Some antivirus engines may detect the miners tools as viruses, you should add the folder `C:\Users\{YOUR_USERNAME}\AppData\Roaming\@bebomining` in the exception list of your antivirus.

## How to run it locally

You need nodejs >= 14.18.1

```sh
npm install --global yarn
```

```sh
yarn
yarn start
```

## Tech Stack

- [Electron](https://www.electronjs.org/)
- [ReactJS](https://reactjs.org/)
- [Socket.IO](https://socket.io/)
- [webRTC](https://webrtc.org/)
- [Sqlite](https://www.sqlite.org/index.html)
 
## License
This software is free to use.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
