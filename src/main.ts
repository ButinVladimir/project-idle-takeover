import 'reflect-metadata';
import '@components';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import '@state/bindings';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import './index.css';

setBasePath('/project-idle-takeover/shoelace');

const appRootElement = document.createElement('ca-app-root');
document.getElementById('root')!.append(appRootElement);
