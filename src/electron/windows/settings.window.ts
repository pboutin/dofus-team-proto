import { ipcMain } from 'electron';
import BaseWindow from './_base.window';
import ConfigRepository from '../repositories/config.repository';
import { GenericModel } from '../../types';
import BaseRepository from '../repositories/_base.repository';

export default class SettingsWindow extends BaseWindow {
  protected slug: 'settings' = 'settings';

  constructor(
    protected modelRepositories: Array<BaseRepository<GenericModel>>,
    protected configRepository: ConfigRepository,
  ) {
    super();

    ipcMain.handle('openSettingsWindow', () => this.open());
  }

  open() {
    if (this.window) {
      this.window.show();
      return;
    }

    this.createWindow({
      width: 800,
      height: 600,
      alwaysOnTop: false,
    });
  }
}
