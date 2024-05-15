export interface Languages {
    language: string
    name: string
    supports_formality: boolean,
    isUsed: boolean
}

export interface TextareaLanguageConfigs {
    id: number
    isLoaded: boolean
    configs: any
    text: string
    isOpen: boolean
}
