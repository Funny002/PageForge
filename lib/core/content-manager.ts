import { reactive, computed, shallowRef } from 'vue'
import type { ComputedRef, ShallowRef } from 'vue'
import type { ContentItem, PropertiesItem, PropertiesSection } from './types'

export class ContentManager<T extends ContentItem> {
  private items = reactive(new Map<string, T>()) as Map<string, T>
  private _cachedItems: ComputedRef<T[]> | null = null

  register(id: string, item: T): void {
    this.items.set(id, item)
  }

  unregister(id: string): void {
    this.items.delete(id)
  }

  getItems(): ComputedRef<T[]> {
    if (!this._cachedItems) {
      this._cachedItems = computed(() =>
        (Array.from(this.items.values()) as T[]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      )
    }
    return this._cachedItems
  }

  getItem(id: string): T | undefined {
    return this.items.get(id) as T | undefined
  }

  clear(): void {
    this.items.clear()
  }
}

export class PropertiesSectionManager extends ContentManager<PropertiesItem> {
  private sections = shallowRef<PropertiesSection[]>([])
  private _sectionComputed = new Map<string, ComputedRef<PropertiesItem[]>>()

  constructor(defaultSections: PropertiesSection[]) {
    super()
    this.sections.value = [...defaultSections].sort((a, b) => a.order - b.order)
  }

  registerSection(section: PropertiesSection): void {
    const existing = this.sections.value.filter((s) => s.id !== section.id)
    this.sections.value = [...existing, section].sort((a, b) => a.order - b.order)
  }

  getSections(): ShallowRef<PropertiesSection[]> {
    return this.sections
  }

  getItemsBySection(sectionId: string): ComputedRef<PropertiesItem[]> {
    let cached = this._sectionComputed.get(sectionId)
    if (!cached) {
      cached = computed(() =>
        this.getItems()
          .value.filter((i) => i.sectionId === sectionId)
          .sort((a, b) => a.priority - b.priority),
      )
      this._sectionComputed.set(sectionId, cached)
    }
    return cached
  }
}
