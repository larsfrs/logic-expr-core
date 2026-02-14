const buttonDownHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5M8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6"/></svg>';
const buttonUpHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5m-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5"/></svg>';
const importantButtonHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/></svg>';

export type Collapsible = {
  id: string;
  step: number;
  equationHtml: string;
  explanationHtml: string;
  type: 'input' | 'intermediate' | 'important' | 'final';
}

/**
 * Generates a collapsible HTML Block.
 */
export function createCollapsible(
  collapsible: Collapsible,
): string {
  const { id, step, equationHtml, explanationHtml, type } = collapsible;

  const hoverClassesBase = 'hover:bg-neutral-700 hover:border-neutral-500 hover:border-solid';
  const boxClassesMapping: Record<Collapsible['type'], string> = {
    'input': hoverClassesBase + ' border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-500',
    'intermediate': hoverClassesBase + ' border border-dashed bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:border-neutral-500',
    'important': hoverClassesBase + ' border border-solid border-yellow-700 hover:border-yellow-600',
    'final': hoverClassesBase + ' border border-solid bg-green-800 border-green-700 hover:bg-green-700 hover:border-green-500',
  };
  const boxClasses = boxClassesMapping[type];
  
  return `
    <div class="${boxClasses} rounded-lg overflow-hidden text-slate-100 mb-4">
      <div
        class="flex items-start gap-x-5 w-full px-4 py-3 cursor-pointer select-none"
        onclick="toggleCollapse('collapse-content-${id}', 'arrow-${id}', 'toggle-btn-${id}')"
        id="toggle-btn-${id}"
        aria-expanded="false"
        role="button"
        tabindex="0"
      >
        <div class="pt-0.5 whitespace-nowrap text text-neutral-300 tabular-nums">
          <span class="inline-flex items-center gap-2">
            ${type === 'input' ? '(0)' : type === 'intermediate' || type === 'important' ? step : 'Final'}.
            ${type === 'important' ? importantButtonHTML : ''}
          </span>
        </div>
        <div class="flex-1 text-center overflow-visible">
          ${equationHtml}
        </div>
        <div class="pt-0.5 self-end">
          <span id="arrow-${id}">${buttonDownHTML}</span>
        </div>
      </div>
      <div id="collapse-content-${id}" class="px-4 py-2 bg-neutral-800 border-neutral-700 border-t hidden">
        ${explanationHtml}
      </div>
    </div>
  `;
}

/**
 * Uniform toggle behaviour.
 */
export function toggleCollapse(contentId: string, arrowId: string, btnId?: string) {
  const content = document.getElementById(contentId);
  const arrow = document.getElementById(arrowId);
  const btn = btnId ? document.getElementById(btnId) : null;

  content?.classList.toggle('hidden');
  if (arrow) arrow.innerHTML = content?.classList.contains('hidden') ? buttonDownHTML : buttonUpHTML;
  if (btn) btn.setAttribute('aria-expanded', (!content?.classList.contains('hidden')).toString());
}

// expose toggle function to global scope for inline onclick handlers
(window as any).toggleCollapse = toggleCollapse;