import type { PlasmoCSConfig } from 'plasmo'
import { getConfig } from 'src/utils/config'
import { key } from 'src/utils/key'

export const config: PlasmoCSConfig = {
  matches: ['https://www.bing.com/*'],
  all_frames: true
}

const isTextArea = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement
  const isChatTextbox = [
    target.tagName === 'TEXTAREA',
    target.getAttribute('name') === 'searchbox'
  ].every(Boolean)
  return isChatTextbox
}

const addEvent = () => {
  document.addEventListener(
    'keydown',
    (e) => {
      if (isTextArea(e)) {
        if (key(e) === 'enter') {
          e.stopPropagation()
        }
      }
    },
    { capture: true }
  )
}

chrome.storage.onChanged.addListener(async () => {
  const config = await getConfig()
  const bingConfig = config.bing

  if (bingConfig) {
    addEvent()
  } else {
    document.removeEventListener(
      'keydown',
      (e) => {
        if (isTextArea(e)) {
          if (key(e) === 'enter') {
            e.stopPropagation()
          }
        }
      },
      { capture: true }
    )
  }
})
