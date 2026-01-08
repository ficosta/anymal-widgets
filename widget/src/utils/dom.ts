/**
 * DOM Utility Functions
 */

interface CreateElementOptions {
  className?: string;
  attributes?: Record<string, string>;
  style?: Record<string, string>;
  innerHTML?: string;
  textContent?: string;
}

/**
 * Create an HTML element with options
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: CreateElementOptions = {},
  parent?: HTMLElement
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (options.style) {
    Object.entries(options.style).forEach(([key, value]) => {
      if (typeof key === 'string' && typeof value === 'string') {
        (element.style as any)[key] = value;
      }
    });
  }

  if (options.innerHTML) {
    element.innerHTML = options.innerHTML;
  } else if (options.textContent) {
    element.textContent = options.textContent;
  }

  if (parent) {
    parent.appendChild(element);
  }

  return element;
}

/**
 * Show loading spinner in element
 */
export function showLoading(element: HTMLElement): HTMLElement | null {
  if (!element) return null;

  element.innerHTML = `
    <div class="loading-block">
      <div class="loading">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      </div>
    </div>
  `;

  return element.querySelector('.loading-block');
}
