import type { MenuItemConstructorOptions, MenuItem, Shell } from 'electron';

const getMenus = (
    appName: string,
    shell: Shell,
    isMac?: boolean,
): (MenuItemConstructorOptions | MenuItem)[] => {
    const githubRepositoryUrl = `https://github.com/bbonkr/renameapp`;

    const menus: MenuItemConstructorOptions[] = [];

    if (isMac) {
        // menus.push({ role: 'appMenu' });
        menus.push({
            label: appName,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' },
            ],
        });
    }

    // menus.push({ role: 'fileMenu' });
    menus.push({
        label: 'File',
        submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    });
    // menus.push({ role: 'editMenu' });

    const macEditMenu: MenuItemConstructorOptions[] = [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
            label: 'Speech',
            submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
        },
    ];
    const otherEditMenu: MenuItemConstructorOptions[] = [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' },
    ];
    menus.push({
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac ? macEditMenu : otherEditMenu),
        ],
    });

    // menus.push({ role: 'viewMenu' });
    menus.push({
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
        ],
    });
    // menus.push({ role: 'windowMenu' });

    const macWindowMenus: MenuItemConstructorOptions[] = [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' },
    ];

    const otherWindowMenus: MenuItemConstructorOptions[] = [{ role: 'close' }];

    menus.push({
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? macWindowMenus : otherWindowMenus),
        ],
    });

    menus.push({
        role: 'help',
        submenu: [
            {
                label: 'About',
                click: () => {
                    try {
                        shell.openExternal(`${githubRepositoryUrl}#readme`);
                    } catch (error) {}
                },
            },
            {
                label: 'GitHub Repository',
                click: () => {
                    try {
                        shell.openExternal(`${githubRepositoryUrl}`);
                    } catch (error) {}
                },
            },
            {
                label: 'Bug report',
                click: () => {
                    try {
                        shell.openExternal(`${githubRepositoryUrl}/issues`);
                    } catch (error) {}
                },
            },
        ],
    });

    return menus;
};

export default getMenus;
