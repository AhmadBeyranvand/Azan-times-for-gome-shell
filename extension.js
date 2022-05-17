/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const _ = ExtensionUtils.gettext;

// Manual Import
const Soup = imports.gi.Soup;
let soupSyncSession = new Soup.SessionSync();

// Manual Import

const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('Azan Times Indicator'));

            this.add_child(new St.Icon({
                icon_name: 'clock-app-symbolic',
                style_class: 'system-status-icon',
            }));



            let getAzanTimes = new PopupMenu.PopupMenuItem(_('Get Azan times today'));
            getAzanTimes.connect('activate', () => {
                Main.notify(_("Getting from server..."))
                let cityCode = 1
                let url = "https://prayer.aviny.com/api/prayertimes/"+cityCode;
                
                let message = Soup.Message.new('GET', url);
                let responseCode = soupSyncSession.send_message(message);
                let res;
                if (responseCode == "200") {
                    res = JSON.parse(message['response-body'].data);

                    Main.notify( _("Data Loaded. Check extension again!") )

                    let fajrAzan = new PopupMenu.PopupMenuItem(_('Fajr azan: ')+res.Imsaak);
                    let sunrise = new PopupMenu.PopupMenuItem(_('Sunrise: ')+res.Sunrise);
                    let noonAzan = new PopupMenu.PopupMenuItem(_('NoonAzan: ')+res.Noon);
                    let sunset = new PopupMenu.PopupMenuItem(_('Sunset: ')+res.Sunset);
                    let maqrebAzan = new PopupMenu.PopupMenuItem(_('Azan Maqreb: ')+res.Maghreb);
                    let midNight = new PopupMenu.PopupMenuItem(_('MidNight: ')+res.Midnight);


                    this.menu.addMenuItem(fajrAzan);
                    this.menu.addMenuItem(sunrise);
                    this.menu.addMenuItem(noonAzan);
                    this.menu.addMenuItem(sunset);
                    this.menu.addMenuItem(maqrebAzan);
                    this.menu.addMenuItem(midNight);

                    } else {
                        Main.notify(_("Unable to Find Server"));
                    }
                });

            this.menu.addMenuItem(getAzanTimes);

        }
    });

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}

function getNextAzanRemain(){
    let
}