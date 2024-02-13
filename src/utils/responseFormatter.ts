import {
  PaginationParams,
  CommonResponse,
} from "@src/interfaces/httpResponseTypes";

export const formatResponse = (
  data: unknown,
  meta?: PaginationParams
): CommonResponse => {
  return meta ? { data, ok: true, meta } : { data, ok: true };
};

/*
      For consistency I prefer not to change response structure, that's why I'm returning
      an array of error texts. So if there will be multiple errors, I'll include them in this array
  */
export const formatError = (
  message: string,
  errors: unknown[] = []
): CommonResponse => {
  return {
    data: null,
    ok: false,
    errors: {
      message,
      all: errors,
    },
  };
};
