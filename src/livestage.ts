import * as fs from 'fs';
import * as path from 'path';
import { window } from 'vscode';
import * as build from './build';
import * as remote from './remote';
import * as factory from './factory';

export default (connector: factory.SSH2Connector | factory.UNIXConnector, workspacePath: string, command: string) =>
{
  if (command === 'start')
  {
    try {
      build.run(workspacePath);
    } catch (error) {
      window.showErrorMessage(`Live Staging: ${error.message || error}`);
      return;
    }
  
    const config = fs.readFileSync(path.join(workspacePath, "dist", "smtpd-app.yaml")).toString();
    const userSettings = JSON.parse(fs.readFileSync(path.join(workspacePath, "settings.json")).toString());
    const conditions = userSettings.livestage && userSettings.livestage.conditions ? userSettings.livestage.conditions : {};
    const id = userSettings.livestage && userSettings.livestage.id ? userSettings.livestage.id : "abcd";

    remote.startLiveStage(connector, id, conditions, config).then(() => {
      window.showInformationMessage('Live Staging: Started');
    }).catch(error => {
      window.showWarningMessage(`Live Staging: ${error.message || error}`);
    });
  }
  else if (command === 'status')
  {
    remote.statusLiveStage(connector).then(status => {
      if (!status) {
        window.showInformationMessage('Live Staging: Not Running');
      } else {
        window.showInformationMessage('Live Staging: ' + JSON.stringify(status));
      }
    }).catch(error => {
      window.showWarningMessage(`Live Staging: ${error.message || error}`);
    });
  }
  else if (command === 'cancel')
  {
    remote.cancelLiveStage(connector).then(() => {
      window.showInformationMessage('Live Staging: Cancelled');
    }).catch(error => {
      window.showWarningMessage(`Live Staging: ${error.message || error}`);
    });
  }
}
