export interface WindowsTool {
  id: string;
  name: string;
  command: string;
  category: 'built_in_ui' | 'powershell_cmd' | 'repair_tool' | 'disk_analyzer';
  description: string;
  purpose: string;
  howToRun: string;
  badge: string;
}

export const WINDOWS_NATIVE_TOOLS: WindowsTool[] = [
  {
    id: 'storage_sense',
    name: 'Windows Storage Sense',
    command: 'ms-settings:storagesense',
    category: 'built_in_ui',
    description: 'Automatic Windows 10/11 built-in cleaner that deletes temporary files and empties the Recycle Bin on a schedule.',
    purpose: 'Hands-off automatic disk cleanup that runs whenever low drive space is detected.',
    howToRun: 'Press Win+R, paste `ms-settings:storagesense` and press Enter. Turn it ON and set schedule to "Every week".',
    badge: 'Windows 10 & 11 Built-in',
  },
  {
    id: 'cleanmgr_advanced',
    name: 'Classic Extended Disk Cleanup (SageSet Mode)',
    command: 'cleanmgr /sageset:65535 & cleanmgr /sagerun:65535',
    category: 'built_in_ui',
    description: 'Launches Microsoft Disk Cleanup with all hidden advanced checkboxes unlocked (System error memory dumps, Windows upgrade logs, old CHKDSK files).',
    purpose: 'Accesses secret cleanup categories hidden in normal Disk Cleanup.',
    howToRun: 'Press Win+R, enter `cleanmgr /sageset:1`, select all checkboxes, click OK. Next time run `cleanmgr /sagerun:1` for instant 1-click execution.',
    badge: 'Power User Secret',
  },
  {
    id: 'dism_analyze',
    name: 'DISM Component Store Space Analyzer',
    command: 'Dism.exe /Online /Cleanup-Image /AnalyzeComponentStore',
    category: 'powershell_cmd',
    description: 'Inspects the actual size of the WinSxS folder and reports whether component cleanup is recommended.',
    purpose: 'Accurately diagnoses how many gigabytes are wasted on superseded Windows components.',
    howToRun: 'Open PowerShell as Administrator, paste the command, and read the "Component Store Cleanup Recommended" verdict.',
    badge: 'Diagnostic',
  },
  {
    id: 'sfc_repair',
    name: 'System File Checker (SFC Scan)',
    command: 'sfc /scannow',
    category: 'repair_tool',
    description: 'Scans all protected Windows system files and replaces corrupted or damaged files with clean cached copies.',
    purpose: 'Fixes slow boot times, explorer crashes, and Windows performance glitches.',
    howToRun: 'Open CMD/PowerShell as Admin, type `sfc /scannow`, and wait for the verification to reach 100%.',
    badge: 'Integrity Repair',
  },
  {
    id: 'ssd_trim',
    name: 'SSD TRIM & Drive Optimization',
    command: 'Optimize-Volume -DriveLetter C -Defrag -Verbose',
    category: 'powershell_cmd',
    description: 'Sends TRIM command to SSD flash memory blocks, clearing deleted data blocks so write speeds stay at maximum peak performance.',
    purpose: 'Restores SSD read/write throughput without causing unnecessary write cycles.',
    howToRun: 'Open PowerShell as Administrator and run the command. For SSDs it performs TRIM; for HDDs it defragments.',
    badge: 'SSD Health',
  },
  {
    id: 'installed_apps',
    name: 'Windows Installed Apps & Large Program Manager',
    command: 'ms-settings:appsfeatures',
    category: 'built_in_ui',
    description: 'Directly opens Windows Installed Apps sorted by size to uninstall unused games and programs on C:.',
    purpose: 'Identify giant 50GB+ games or apps that can be moved to D: drive or uninstalled.',
    howToRun: 'Press Win+R, paste `ms-settings:appsfeatures` and hit Enter. Sort by "Size (Large to small)".',
    badge: 'Space Hog Finder',
  },
  {
    id: 'vss_shadow_cleanup',
    name: 'Delete Old Volume Shadow Copies & Restore Points',
    command: 'vssadmin delete shadows /for=C: /all /quiet',
    category: 'powershell_cmd',
    description: 'Deletes old orphaned system restore points and VSS shadow copies that consume up to 10% of drive capacity.',
    purpose: 'Instant recovery of 5GB to 25GB if Windows System Restore has accumulated dozens of old snapshots.',
    howToRun: 'Open CMD as Admin and paste `vssadmin delete shadows /for=C: /all /quiet`.',
    badge: 'Instant Space Booster',
  },
];

export const FOLDER_RELOCATION_TIPS = [
  {
    title: 'Move Default "Downloads" Folder to D: / E: Drive',
    impact: 'Reclaims 10GB – 100GB+ from C:',
    steps: [
      'Open File Explorer (Win+E) and click "This PC".',
      'Right-click your "Downloads" folder and select "Properties".',
      'Navigate to the "Location" tab.',
      'Click "Move...", select a folder on your D: or secondary drive (e.g. `D:\\Downloads`), and click "Apply".',
      'Click "Yes" when asked to move existing files to the new location.',
    ],
  },
  {
    title: 'Relocate Large Temp / Scratch Caches (Photoshop / Premiere / After Effects / DaVinci)',
    impact: 'Reclaims 20GB – 80GB+',
    steps: [
      'In Adobe Premiere/Photoshop/DaVinci Resolve, go to Preferences > Media Cache / Scratch Disks.',
      'Change the scratch directory from `C:\\Users\\...\\AppData` to a fast secondary drive (e.g. `D:\\AdobeCache`).',
      'Delete old media cache databases.',
    ],
  },
  {
    title: 'Relocate Steam / Epic Games / Xbox Game Pass default install path',
    impact: 'Reclaims 50GB – 300GB+',
    steps: [
      'Steam: Settings > Storage > Add Drive > Set secondary drive as Default.',
      'Epic Games: When installing any game, select `D:\\Games`. For existing games, move directory and verify integrity.',
      'Xbox App: Settings > General > "Change where this app installs games by default" to D: drive.',
    ],
  },
  {
    title: 'Clear Spotify / iTunes / Discord Local Caches',
    impact: 'Reclaims 3GB – 15GB',
    steps: [
      'Spotify: Settings > Storage > "Clear cache" or change offline songs download location to D:.',
      'Apple iTunes: Device backups are stored in `%APPDATA%\\Apple Computer\\MobileSync\\Backup`. Delete old phone backups.',
      'Discord: Delete cache in `%APPDATA%\\discord\\Cache`.',
    ],
  },
];
