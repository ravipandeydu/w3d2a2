export interface BoundingBox {
  coordinates: [number, number, number, number]; // [x1, y1, x2, y2]
  context: string;
}

export interface QAResponse {
  answer: string;
  boundingBoxes: BoundingBox[];
  model: string;
  fallback?: boolean;
}

export interface ImageQuestionRequest {
  image?: File | null;
  imageUrl?: string;
  question: string;
}