import { sleep } from "k6";
import http from "k6/http";
import { FormData } from "https://jslib.k6.io/formdata/0.0.2/index.js";
import * as factory from "./factory.js";

export const sing_in = (host, username, password) => {
  const login_form_response = http.get(`https://${host}/users/log_in`);

  const response = login_form_response.submitForm({
    formSelector: "#body > main > article > form",
    fields: { "user[email]": username, "user[password]": password },
  });

  return response;
};

export const visit_list_asset_page = (host) => {
  return http.get(`https://${host}/admin/assets`);
};

export const visit_public_list_asset_page = (host) => {
  return http.get(`https://${host}/assets`);
};

export const visit_asset_page = (host) => {
  return http.get(`https://${host}/admin/assets/new`);
};

export const visit_upload_page = (host) => {
  return http.get(`https://${host}/admin/uploads/new`);
};

export const upload_asset = (host, files) => {
  const uploadPageResponse = visit_upload_page(host);
  sleep(1);

  const csrfToken = uploadPageResponse
    .html()
    .find("#upload-assets-form > input[name=_csrf_token]")
    .attr("value");

  const img = factory.get_random(files);
  const file = http.file(img.content, img.filename, img.content_type);
  const form = new FormData();
  form.append("_csrf_token", csrfToken);
  form.append("upload[file][]", file);

  const url = `https://${host}/admin/uploads`;
  const body = form.body;
  const headers = {
    "Content-Type": "multipart/form-data; boundary=" + form.boundary,
  };

  const res = http.post(url, form.body(), { headers });

  return res;
};
