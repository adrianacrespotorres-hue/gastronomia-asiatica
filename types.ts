export enum SlideLayout {
    TitleOnly = 'TITLE_ONLY',
    TextAndImage = 'TEXT_AND_IMAGE',
    BulletPoints = 'BULLET_POINTS',
    Chart = 'CHART',
    Conclusion = 'CONCLUSION'
}

export interface ChartDataPoint {
    name: string;
    value: number;
}

export interface SlideContent {
    id: number;
    title: string;
    subtitle?: string;
    body: string;
    bulletPoints?: string[];
    imageKeyword?: string; // For Picsum
    layout: SlideLayout;
    chartData?: ChartDataPoint[];
    chartLabel?: string;
}

export interface Presentation {
    topic: string;
    slides: SlideContent[];
}