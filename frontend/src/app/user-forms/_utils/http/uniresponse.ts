export class UniResponse {
    public static HTTP_CODE_200_OK = 200;
    public static HTTP_CODE_401_UNAUTHORIZED = 401;
    public static HTTP_CODE_403_FORBIDDEN = 403;
    public static HTTP_CODE_404_NOT_FOUND = 404;

    public static CODE_OK = 1;
    public static CODE_UNAUTHORIZED = -100;
    public static CODE_NETWORK_ERROR = -101;
    public static CODE_NOT_FOUND = -120;
    public static CODE_FAILED = -1;
    public static CODE_ALREADY_EXISTS = -2;




    _http_code: number
    _code: number 
    _data_text: string|null|undefined
    _data_json: string|null|undefined
  
    constructor(http_code: number, code: number, data_text: string|null|undefined, data_json: string|null|undefined) {
      this._http_code = http_code;
      this._code = code;
      this._data_text = data_text;
      this._data_json = data_json;
    }
  
    get http_code() {
      return this._http_code;
    }
  
    get code() {
      return this._code;
    }
  
    get data_text() {
      return this._data_text;
    }
  
    get data_json() {
      return this._data_json;
    }
  
    get data_json_as_obj(): any|null|undefined {
      if((this._data_json != undefined) && (this._data_json != null) && (this._data_json != "")) {
        try {
          const res = JSON.parse(this._data_json);
          return res;
        } catch (SyntaxError) {
          return null;
        }
      }
  
      return null;
    }
  }