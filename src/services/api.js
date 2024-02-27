// Don't repeat urself

import axiosApiInstance from './interceptor';

export default {
  methods: {
    getData(PATH) {
      return new Promise((resolve, reject) => {
        axiosApiInstance
          .get(`${PATH}`)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getDataWithOptions(PATH, options) {
      return new Promise((resolve, reject) => {
        axiosApiInstance
          .get(`${PATH}`, options)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    postData(PATH, payload) {
      return new Promise((resolve, reject) => {
        axiosApiInstance
          .post(`${PATH}`, payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    patchData(PATH, payload) {
      return new Promise((resolve, reject) => {
        axiosApiInstance
          .patch(`${PATH}`, payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error.resopnse);
          });
      });
    },
    deleteData(PATH) {
      return new Promise((resolve, reject) => {
        axiosApiInstance
          .delete(`${PATH}`)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    putData(PATH, payload) {
      return new Promise((resolve, reject) => {
        axiosApiInstance
          .put(`${PATH}`, payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error.resopnse);
          });
      });
    }
  }
};
