import axios from "axios";
import _ from "lodash";
import common from "common/index";

const url = common.apiUrl();

export default {
  login() {
    return {
      submit: (passCode) => {
        return (async function () {
          return await (await axios.post(`${url}/Authenticate`, { passCode }))
            .data;
        })()
          .then((data) => data)
          .catch((data) => data.response);
      },
      renew: (jwtToken) => {
        return (async function () {
          let config = {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          };
          return await (await axios.get(`${url}/Authenticate/renew`, config))
            .data;
        })()
          .then((data) => data)
          .catch((data) => data.response);
      },
    };
  },
  get() {
    return {
      getPdfRangeByParentPdfInput: (
        formVersionId,
        headers,
        sectionId,
        questionId,
        rangeId,
        legacyPdfId
      ) => {
        return (async function () {
          return await (
            await axios.get(
              `${url}/formVersions/${formVersionId}/sections/${sectionId}/questions/${questionId}/pdfInputRanges/${rangeId}/parentPdfInputs/${legacyPdfId}`,
              headers
            )
          ).data;
        })().then((data) => data);
      },
      getlegacyPdfIdByPdfInputId: (headers, sectionId, pdfInputId) => {
        return (async function () {
          return await (
            await axios.get(
              `${url}/sections/${sectionId}/legacyPdfSettings/${pdfInputId}`,
              headers
            )
          ).data;
        })().then((data) => data);
      },
      getLegacyPdfSettingsByRangeId: (
        headers,
        sectionId,
        questionId,
        pdfRangeId
      ) => {
        return (async function () {
          return await (
            await axios.get(
              `${url}/sections/${sectionId}/questions/${questionId}/legacyPdfSettings/${pdfRangeId}`,
              headers
            )
          ).data;
        })().then((data) => data);
      },
      getLegacyPdfSettingsRangeNames: (headers, sectionId, formVersionId) => {
        return (async function () {
          return await (
            await axios.get(
              `${url}/formversions/${formVersionId}/sections/${sectionId}/questions/1/legacyPdfSettings/1/rangeNames`,
              headers
            )
          ).data;
        })().then((data) => data);
      },
      getLegacyPdfSettingsByQuestionId: (
        headers,
        questionId,
        sectionId,
        formVersionId
      ) => {
        return (async function () {
          return await (
            await axios.get(
              `${url}/formversions/${formVersionId}/sections/${sectionId}/questions/${questionId}/legacyPdfSettings`,
              headers
            )
          ).data;
        })().then((data) => data);
      },
      questionHtmlPreview: (headers, questionId) => {
        return (async function () {
          return await (
            await axios.get(
              `${url}/questions/${questionId}/previewHtml`,
              headers
            )
          ).data;
        })().then((data) => data);
      },
      adviserDetailsByAdviserId: (
        headers,
        formId,
        formVersionId,
        adviserId
      ) => {
        return (async function () {
          return await (
            await axios.get(
              `${url}/forms/${formId}/formversions/${formVersionId}/adviserDetails/${adviserId}`,
              headers
            )
          ).data;
        })().then((data) => data);
      },
      formBenefitById: (headers, formId, formVersionId, formBenefitId) => {
        return (async function () {
          return await (
            await axios.get(
              `${url}/forms/${formId}/formversions/${formVersionId}/formbenefits/${formBenefitId}`,
              headers
            )
          ).data;
        })().then((data) => data);
      },
      sectionQuestionErrors: (headers, formVersionId, sectionId) => {
        async function getSectionQuestionErrors(
          headers,
          formVersionId,
          sectionId
        ) {
          return await (
            await axios.get(
              `${url}/formversions/${formVersionId}/sections/${sectionId}/questions/-1/errors`,
              headers
            )
          ).data;
        }

        return getSectionQuestionErrors(headers, formVersionId, sectionId).then(
          (data) => data
        );
      },
      formVersionsComplexByFormId: (headers, formId) => {
        async function getByProviderId(headers, formId) {
          return await (
            await axios.get(`${url}/forms/${formId}/formversions`, headers)
          ).data;
        }

        return getByProviderId(headers, formId).then((data) => data);
      },
      formsById: (headers, formId) => {
        async function getAllForms(headers, formId) {
          return await (await axios.get(`${url}/forms/${formId}`, headers))
            .data;
        }

        return getAllForms(headers, formId).then((data) => data);
      },
      formsAll: (headers) => {
        async function getAllForms(headers) {
          return await (await axios.get(`${url}/forms`, headers)).data;
        }

        return getAllForms(headers).then((data) => data);
      },
      formsArchived: (headers) => {
        async function getArchivedForms(headers) {
          return await (await axios.get(`${url}/forms/-1/archived`, headers))
            .data;
        }

        return getArchivedForms(headers).then((data) => data);
      },
      sectionBenefitByBenefitId: (headers, sectionBenefitId) => {
        async function getSectionBenefitByBenefitId() {
          return await (
            await axios.get(
              `${url}/sectionBenefits/${sectionBenefitId}`,
              headers
            )
          ).data;
        }

        return getSectionBenefitByBenefitId().then((data) => data);
      },

      sectionBenefitBySectionId: (headers, sectionSettingId) => {
        async function getSectionBenefitBySectionId() {
          return await (
            await axios.get(
              `${url}/sectionSettings/${sectionSettingId}/sectionBenefits`,
              headers
            )
          ).data;
        }

        return getSectionBenefitBySectionId().then((data) => data);
      },

      sectionSettingById: (headers, sectionId, sectionSettingId) => {
        async function getSectionSettingById() {
          return await (
            await axios.get(
              `${url}/sections/${sectionId}/sectionSettings/${sectionSettingId}`,
              headers
            )
          ).data;
        }

        return getSectionSettingById().then((data) => data);
      },
      sectionSettingInitial: (headers, sectionId) => {
        async function getSectionSettingInitial() {
          return await (
            await axios.get(
              `${url}/sections/${sectionId}/sectionSettings/0`,
              headers
            )
          ).data;
        }

        return getSectionSettingInitial().then((data) => data);
      },
      sectionBySectionId: (headers, sectionId) => {
        async function getSection() {
          return await (
            await axios.get(`${url}/sections/${sectionId}/details`, headers)
          ).data;
        }

        return getSection().then((data) => data);
      },
      formVersionAllDetails: (headers, formId, formVersionId) => {
        async function getFormVersionAllDetails() {
          return await (
            await axios.get(
              `${url}/forms/${formId}/formversions/${formVersionId}`,
              headers
            )
          ).data;
        }

        return getFormVersionAllDetails().then((data) => data);
      },
      providers: (headers) => {
        async function getProviders() {
          return await (await axios.get(`${url}/providers`, headers)).data;
        }

        return getProviders().then((data) => data);
      },
      forms: (headers, providerId) => {
        async function getForms(providerId) {
          return await (
            await axios.get(`${url}/providers/${providerId}/forms`, headers)
          ).data;
        }

        return getForms(providerId).then((data) => data);
      },
      formVersion: (headers, formId) => {
        async function getformVersions(formId) {
          return await (
            await axios.get(`${url}/forms/${formId}/versions`, headers)
          ).data;
        }

        return getformVersions(formId).then((data) => data);
      },
      sections: (headers, formversionid) => {
        async function getSections(formversionid) {
          return await (
            await axios.get(`${url}/sections/${formversionid}`, headers)
          ).data;
        }

        return getSections(formversionid).then((data) => data);
      },
      sectionQuestions: (headers, sectionId) => {
        async function getSectionQuestions(sectionId) {
          return await (
            await axios.get(`${url}/sections/${sectionId}/questions`, headers)
          ).data;
        }

        return getSectionQuestions(sectionId).then((data) => data);
      },
      questionDetails: (headers, questionId, sectionId) => {
        async function getQuestionDetails(questionId) {
          return await (
            await axios.get(
              `${url}/sections/${sectionId}/questions/${questionId}/details`,
              headers
            )
          ).data;
        }

        return getQuestionDetails(questionId).then((data) => data);
      },
      questionOptions: (headers, questionId) => {
        async function getQuestionOptions(questionId) {
          return await (
            await axios.get(`${url}/questions/${questionId}/options`, headers)
          ).data;
        }

        return getQuestionOptions(questionId).then((data) => data);
      },
      optionsByParentQuestion: (headers, parentQuestionId) => {
        async function getOptions(parentQuestionId) {
          return await (
            await axios.get(`${url}/options/${parentQuestionId}`, headers)
          ).data;
        }

        return getOptions(parentQuestionId).then((data) => data);
      },
      parentQuestionBySectionId: (headers, sectionId) => {
        async function getParentQuestions(sectionId) {
          return await (
            await axios.get(`${url}/sections/${sectionId}/sectionId`, headers)
          ).data;
        }

        return getParentQuestions(sectionId).then((data) => data);
      },
      questionSubQuestions: (headers, questionId, sectionId) => {
        async function getQuestionSubQuestions(questionId) {
          return await (
            await axios.get(
              `${url}/questions/${questionId}/sections/${sectionId}`,
              headers
            )
          ).data;
        }

        return getQuestionSubQuestions(questionId).then((data) => data);
      },
      filterSelects: (headers, inputs) => {
        async function getFilterSelects(inputs) {
          return await (
            await axios.get(
              `${url}/providers/${inputs.providerId}/forms/${inputs.formId}/versions/${inputs.formVersionId}/sections`,
              headers
            )
          ).data;
        }

        return getFilterSelects(inputs).then((data) => data);
      },
      getDataNewQuestion: (headers, inputs) => {
        async function getQuestionDetails(inputs) {
          const formversiontxt = "formversion";

          const sectiontxt = "section";

          const parentQuestionId = "questionId";

          const formversion =
            _.first(_.map(_.find(inputs, formversiontxt))) ||
            inputs[formversiontxt];

          const section =
            _.first(_.map(_.find(inputs, sectiontxt))) || inputs[sectiontxt];

          const parentQuestion =
            _.first(_.map(_.find(inputs, parentQuestionId))) ||
            inputs[parentQuestionId];

          return await (
            await axios.get(
              `${url}/formVersions/${formversion}/sections/${section}/parentQuestionId/${
                parentQuestion || 0
              }`,
              headers
            )
          ).data;
        }

        return getQuestionDetails(inputs).then((data) => data);
      },
      getQuestionTables: (headers) => {
        async function getQuestionTables() {
          return await (await axios.get(`${url}/questions/tables`, headers))
            .data;
        }

        return getQuestionTables().then((data) => data);
      },
      getQuestionCellSettings: (headers) => {
        async function getSettings() {
          return await (
            await axios.get(
              `${url}/questions/tables/questionCells/settings`,
              headers
            )
          ).data;
        }

        return getSettings().then((data) => data);
      },
      getQuestionTableDetails: (headers, questionId) => {
        async function getQuestionTableDetails() {
          return await (
            await axios.get(`${url}/questions/${questionId}/tables`, headers)
          ).data;
        }

        return getQuestionTableDetails().then((data) => data);
      },
      optionsQuickAdd: (headers, responseTypeId, tableInfo) => {
        async function getOptionsQuickAddValues() {
          const { column, row, questionTableId } = tableInfo;

          return await (
            await axios.get(
              `${url}/options/${responseTypeId}/${questionTableId}/${row}/${column}/quickAdd`,
              headers
            )
          ).data;
        }

        return getOptionsQuickAddValues().then((data) => data);
      },
      optionsSimpleQuickAdd: (headers, responseTypeId) => {
        async function getOptionsSimpleQuickAddValues() {
          return await (
            await axios.get(
              `${url}/options/${responseTypeId}/quickAdd`,
              headers
            )
          ).data;
        }

        return getOptionsSimpleQuickAddValues().then((data) => data);
      },
    };
  },
  getWithBody() {
    return {
      sectionIdByQuestionId: (headers, questionIds) => {
        return (async function () {
          return await (
            await axios.post(`${url}/questionUrls`, questionIds, headers)
          ).data;
        })().then((data) => data);
      },
    };
  },
  update: function () {
    return {
      questionHeadingById: (headers, sectionId, data) => {
        return (async function () {
          return await await axios
            .post(
              `${url}/sections/${sectionId}/questionHeadings/${data.id}`,
              data,
              headers
            )
            .catch((data) => data.response);
        })().then((data) => data);
      },
      legacyPdfSettingsByQuestionId: (headers, inputs, questionId) => {
        return (async function () {
          return await await axios
            .post(
              `${url}/questions/${questionId}/legacyPdfSettings`,
              inputs,
              headers
            )
            .catch((data) => data.response);
        })().then((data) => data);
      },
      adviserDetailsByAdviserId: (headers, inputs) => {
        return (async function () {
          const { formId, formVersionId, adviserDetailsId } = inputs;

          return await await axios
            .post(
              `${url}/forms/${formId}/formversions/${formVersionId}/adviserDetails/${adviserDetailsId}`,
              inputs,
              headers
            )
            .catch((data) => data.response);
        })().then((data) => data);
      },
      formBenefitById: (headers, inputs) => {
        return (async function () {
          const { formId, formVersionId, formBenefitId } = inputs;

          return await await axios
            .post(
              `${url}/forms/${formId}/formversions/${formVersionId}/formbenefits/${formBenefitId}`,
              inputs,
              headers
            )
            .catch((data) => data.response);
        })().then((data) => data);
      },
      formsById: (headers, inputs, formId) => {
        async function updateFormsById(headers, formId) {
          return await (
            await axios.post(`${url}/forms/${formId}`, inputs, headers)
          ).data;
        }

        return updateFormsById(headers, formId).then((data) => data);
      },
      sectionBenefitByBenefitId: (headers, inputs) => {
        async function update(inputs) {
          return await await axios
            .post(
              `${url}/sectionBenefits/${inputs.sectionBenefitId}`,
              inputs,
              headers
            )
            .catch((data) => data.response);
        }

        return update(inputs).then((data) => data);
      },

      sectionSettingById: (headers, sectionSettingId, sectionId, inputs) => {
        async function updateSectionSettingById(
          sectionSettingId,
          sectionId,
          inputs
        ) {
          return await await axios
            .post(
              `${url}/sections/${sectionId}/sectionSettings/${sectionSettingId}`,
              inputs,
              headers
            )
            .catch((data) => data.response);
        }

        return updateSectionSettingById(
          sectionSettingId,
          sectionId,
          inputs
        ).then((data) => data);
      },

      sectionBySectionId: (headers, inputs) => {
        async function updateOption(inputs) {
          return await await axios
            .post(`${url}/sections/${inputs.sectionId}`, inputs, headers)
            .catch((data) => data.response);
        }

        return updateOption(inputs).then((data) => data);
      },
      formVersion: (headers, inputs) => {
        async function updateOption(inputs) {
          return await await axios
            .post(
              `${url}/formversions/${inputs.formVersionId}`,
              inputs,
              headers
            )
            .catch((data) => data.response);
        }

        return updateOption(inputs).then((data) => data);
      },
      questionOptions: (headers, data) => {
        async function updateOption(data) {
          return await await axios
            .post(
              `${url}/questions/${data.questionId}/options/${data.optionId}`,
              data,
              headers
            )
            .catch((data) => data.response);
        }

        return updateOption(data).then((data) => data);
      },
      question: (headers, inputs, questionId, sectionId) => {
        async function updateQuestion(inputs, questionId, sectionId) {
          return await await axios
            .post(
              `${url}/sections/${sectionId}/questions/${questionId}`,
              inputs,
              headers
            )
            .catch((error) => error.response);
        }

        return updateQuestion(inputs, questionId, sectionId).then(
          (data) => data
        );
      },
      questionTable: (headers, inputValues, tableId) => {
        async function updateQuestionTable(inputValues, tableId) {
          return await await axios.post(
            `${url}/questions/tables/${tableId}`,
            inputValues,
            headers
          );
        }

        return updateQuestionTable(inputValues, tableId).then((data) => data);
      },
    };
  },
  insert() {
    return {
      questionHeadingById: (headers, sectionId, inputs) => {
        return (async function () {
          return await await axios
            .post(
              `${url}/sections/${sectionId}/questionHeadings`,
              inputs,
              headers
            )
            .catch((data) => data.response);
        })().then((data) => data);
      },
      adviserDetailsByAdviserId: (headers, inputs) => {
        return (async function () {
          const { formId, formVersionId } = inputs;

          return await await axios
            .post(
              `${url}/forms/${formId}/formversions/${formVersionId}/adviserDetails`,
              inputs,
              headers
            )
            .catch((data) => data.response);
        })().then((data) => data);
      },
      formBenefitById: (headers, inputs) => {
        return (async function () {
          const { formId, formVersionId } = inputs;

          return await await axios
            .post(
              `${url}/forms/${formId}/formversions/${formVersionId}/formbenefits`,
              inputs,
              headers
            )
            .catch((data) => data.response);
        })().then((data) => data);
      },
      formById: (headers, inputs) => {
        async function update(inputs) {
          return await await axios
            .post(`${url}/forms`, inputs, headers)
            .catch((data) => data.response);
        }

        return update(inputs).then((data) => data);
      },

      formVersion: (headers, data) => {
        async function insertNewFormVersion(data) {
          return await await axios
            .post(`${url}/formversions`, data, headers)
            .catch((data) => data.response);
        }

        return insertNewFormVersion(data).then((data) => data);
      },

      sectionBenefitByBenefitId: (headers, inputs) => {
        async function update(inputs) {
          return await await axios
            .post(`${url}/sectionBenefits`, inputs, headers)
            .catch((data) => data.response);
        }

        return update(inputs).then((data) => data);
      },

      sectionSetting: (headers, data) => {
        async function insertNewSectionSetting(data) {
          return await await axios
            .post(`${url}/sectionSettings`, data, headers)
            .catch((data) => data.response);
        }

        return insertNewSectionSetting(data).then((data) => data);
      },
      sectionCopy: (headers, data) => {
        async function insertNewSectionCopy(data) {
          return await await axios
            .post(`${url}/sections/copy`, data, headers)
            .catch((data) => data.response);
        }

        return insertNewSectionCopy(data).then((data) => data);
      },
      section: (headers, data) => {
        async function insertNewSection(data) {
          return await await axios
            .post(`${url}/sections`, data, headers)
            .catch((data) => data.response);
        }

        return insertNewSection(data).then((data) => data);
      },
      questionOption: (headers, data) => {
        async function insertNewOption(data) {
          return await await axios
            .post(`${url}/questions/${data.questionId}/option`, data, headers)
            .catch((data) => data.response);
        }

        return insertNewOption(data).then((data) => data);
      },
      questionOptions: (headers, data) => {
        async function insertNewOptions(data) {
          return await await axios
            .post(
              `${url}/questions/${data[0].questionId}/options`,
              data,
              headers
            )
            .catch((data) => data.response);
        }

        return insertNewOptions(data).then((data) => data);
      },
      newQuestion: (headers, data) => {
        async function insertNewQuestion(data) {
          return await (
            await axios
              .post(`${url}/questions`, data, headers)
              .catch((error) => error.response)
          ).data;
        }

        return insertNewQuestion(data).then((data) => data);
      },
      questionTable: (headers, data) => {
        async function insertNewQuestionTable(data) {
          return await (
            await axios.post(`${url}/questions/tables`, data, headers)
          ).data;
        }

        return insertNewQuestionTable(data).then((data) => data);
      },
    };
  },
  delete() {
    return {
      questionHeadingById: (headers, sectionId, inputs, forcedDelete) => {
        return (async function () {
          return await await axios
            .delete(
              `${url}/sections/${sectionId}/questionHeadings/${inputs.id}/forcedDelete/${forcedDelete}`,
              null,
              headers
            )
            .catch((data) => data.response);
        })().then((data) => data);
      },
      adviserDetailsByAdviserId: (headers, inputs) => {
        return (async function () {
          const { formId, formVersionId, adviserDetailsId } = inputs;

          return await await axios
            .delete(
              `${url}/forms/${formId}/formversions/${formVersionId}/adviserDetails/${adviserDetailsId}`,
              null,
              headers
            )
            .catch((data) => data.response);
        })().then((data) => data);
      },
      formBenefitById: (headers, inputs) => {
        return (async function () {
          const { formId, formVersionId, formBenefitId } = inputs;

          return await await axios
            .delete(
              `${url}/forms/${formId}/formversions/${formVersionId}/formbenefits/${formBenefitId}`,
              null,
              headers
            )
            .catch((data) => data.response);
        })().then((data) => data);
      },
      options: (headers, optionId) => {
        async function deleteOption(optionId) {
          return await (
            await axios.delete(`${url}/options/${optionId}`, null, headers)
          ).data;
        }

        return deleteOption(optionId).then((data) => data);
      },
      section: (headers, inputs) => {
        async function deleteSection(inputs) {
          return await (
            await axios.delete(
              `${url}/forms/${inputs.formId}/formversions/${inputs.formVersionId}/sections/${inputs.sectionId}`,
              null,
              headers
            )
          ).data;
        }

        return deleteSection(inputs).then((data) => data);
      },
      sectionQuestionItem: (headers, questionId, sectionId, forceDelete) => {
        async function deleteSectionQuestionItem(questionId, sectionId) {
          return await await axios
            .delete(
              `${url}/sections/${sectionId}/sectionQuestions/${questionId}/${forceDelete}`,
              null,
              headers
            )
            .catch((data) => data.response);
        }

        return deleteSectionQuestionItem(questionId, sectionId).then(
          (data) => data
        );
      },
      questions: (headers, sectionId, questionId) => {
        async function deleteQuestion(questionId) {
          return await (
            await axios.delete(
              `${url}/sections/${sectionId}/questions/${questionId}`,
              null,
              headers
            )
          ).data;
        }

        return deleteQuestion(questionId).then((data) => data);
      },
      tableAndCells: (headers, questionId) => {
        async function deleteTableAndCells(questionId) {
          return await (
            await axios.delete(
              `${url}/questions/${questionId}/tables`,
              null,
              headers
            )
          ).data;
        }

        return deleteTableAndCells(questionId).then((data) => data);
      },
    };
  },
};
