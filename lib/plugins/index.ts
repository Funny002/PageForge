import type { PageForgePlugin } from '../core/types'
import { shortcutsPlugin } from './shortcuts'
import { nodeManagerPlugin } from './node-manager'
import { componentLibraryPlugin } from './component-library'
import { themePlugin } from './theme'
import { rectPlugin } from './nodes/rect'
import { circlePlugin } from './nodes/circle'
import { textPlugin } from './nodes/text'
import { imagePlugin } from './nodes/image'
import { linePlugin } from './nodes/line'
import { groupPlugin } from './nodes/group'

export const builtinPlugins: PageForgePlugin[] = [
  shortcutsPlugin,
  nodeManagerPlugin,
  componentLibraryPlugin,
  themePlugin,
  rectPlugin,
  circlePlugin,
  textPlugin,
  imagePlugin,
  linePlugin,
  groupPlugin,
]

export {
  shortcutsPlugin,
  nodeManagerPlugin,
  componentLibraryPlugin,
  themePlugin,
  rectPlugin,
  circlePlugin,
  textPlugin,
  imagePlugin,
  linePlugin,
  groupPlugin,
}
