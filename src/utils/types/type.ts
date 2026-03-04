export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface Mail {
  id: string;
  subject: string;
  receivedDateTime: string;
  body: {
    contentType: string;
    content: string;
  };
  from: {
    emailAddress: {
      address: string;
      name: string;
    };
  };
}

export interface GraphResponse<T> {
  value: T[];
}
