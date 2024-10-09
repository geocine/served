import { Server } from './types';

export const servers: Server[] = [
  {
    name: 'qa1',
    components: [
      {
        url: 'https://qa1.example.com/device1',
        name: 'Device 1',
        pid: 'PID001',
        version: '1.0.0',
        commit: 'abc123',
        packageDependencies: [
          { name: 'dep1', commit: 'def456' },
          { name: 'dep2', commit: 'ghi789' },
        ],
        binaryDependencies: [
          { name: 'bin1', version: '2.0.0' },
          { name: 'bin2', version: '3.1.0' },
        ],
      },
      {
        url: 'https://qa1.example.com/device2',
        name: 'Device 2',
        pid: 'PID002',
        version: '1.5.0',
        commit: 'jkl012',
        packageDependencies: [
          { name: 'dep3', commit: 'mno345' },
        ],
        binaryDependencies: [
          { name: 'bin3', version: '1.0.0' },
        ],
      },
      {
        url: 'https://qa1.example.com/common1',
        name: 'Common 1',
        version: '1.1.0',
        commit: 'pqr678',
        dependencies: ['dep4', 'dep5'],
        files: ['config.json', 'data.json'],
      },
    ],
  },
  {
    name: 'prod',
    components: [
      {
        url: 'https://prod.example.com/device1',
        name: 'Device 1',
        pid: 'PID001',
        version: '2.0.0',
        commit: 'stu901',
        packageDependencies: [
          { name: 'dep1', commit: 'vwx234' },
          { name: 'dep2', commit: 'yz0567' },
        ],
        binaryDependencies: [
          { name: 'bin1', version: '2.5.0' },
          { name: 'bin2', version: '3.2.0' },
        ],
      },
      {
        url: 'https://prod.example.com/device2',
        name: 'Device 2',
        pid: 'PID002',
        version: '2.0.0',
        commit: 'abc890',
        packageDependencies: [
          { name: 'dep3', commit: 'def123' },
        ],
        binaryDependencies: [
          { name: 'bin3', version: '1.5.0' },
        ],
      },
      {
        url: 'https://prod.example.com/common1',
        name: 'Common 1',
        version: '2.0.0',
        commit: 'ghi456',
        dependencies: ['dep4', 'dep5', 'dep6'],
        files: ['config.json', 'data.json', 'settings.json'],
      },
    ],
  },
];