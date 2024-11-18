import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

export const CloudinaryConfig = {
  provide: 'Cloudinary',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'djqtuacy7',
      api_key: '934599613136622',
      api_secret: 'jPCXq-eYZkDnYxOjwHxA-65YedY',
    });
  },
};
