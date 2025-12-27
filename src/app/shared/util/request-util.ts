import { HttpParams } from '@angular/common/http';

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).forEach(key => {
      if (key !== 'sort') {
        const value = req[key];
        // Handle arrays for .in filters
        if (Array.isArray(value)) {
          value.forEach(val => {
            options = options.append(key, val);
          });
        } else {
          options = options.set(key, value);
        }
      }
    });
    if (req.sort) {
      req.sort.forEach(val => {
        options = options.append('sort', val);
      });
    }
  }
  return options;
};
