import { setupPermissionDirective } from './permission'
import { setupOverflowTooltipDirective } from './overflowTooltip'
import { setupTooltipDirective } from './tooltip'

export function setupGlobDirectives(app) {
  setupPermissionDirective(app)
  setupOverflowTooltipDirective(app)
  setupTooltipDirective(app)
}
