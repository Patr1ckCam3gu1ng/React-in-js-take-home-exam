const fields = [
  [
    {
      id: "providerName",
      labelText: "Provider",
      colSpan: 4,
      required: true,
      disabled: true,
    },
    {
      id: "formName",
      labelText: "Form",
      colSpan: 4,
      required: true,
      disabled: true,
    },
    {
      id: "versionNumber",
      labelText: "Form Version",
      colSpan: 4,
      required: true,
      type: "select",
    },
  ],
  [
    {
      id: "sectionName",
      labelText: "Section",
      colSpan: 2,
      required: true,
      type: "select",
    },
    {
      id: "questionOrder",
      labelText: "Order",
      colSpan: 2,
      required: true,
      isNumber: true,
    },
    {
      id: "questionHeading",
      labelText: "Heading",
      colSpan: 4,
      type: "select",
    },
    {
      id: "legacyPdfSettings",
      labelText: "Legacy PDF Settings",
      colSpan: 4,
      isAnchor: true,
    },
  ],
  [
    {
      id: "hideLabel",
      labelText: "Hide Label",
      colSpan: 2,
      type: "select",
    },
    {
      id: "questionLabel",
      labelText: "Label",
      colSpan: 10,
      required: true,
    },
  ],
  [
    {
      id: "responseType",
      labelText: "Response Type",
      colSpan: 2,
      required: true,
      type: "select",
      autoComplete: true,
      group: "responseType",
    },
    {
      id: "dateAccuracy",
      labelText: "Accuracy",
      colSpan: 2,
      type: "select",
      group: "dateAccuracy",
      readOnlyThis: true,
    },
    {
      id: "requiredStatus",
      labelText: "Required Type",
      colSpan: 2,
      type: "select",
    },
    {
      id: "gender",
      labelText: "Gender",
      colSpan: 2,
      type: "select",
    },
    {
      id: "min",
      labelText: "Min",
      colSpan: 2,
      disabled: true,
    },
    {
      id: "max",
      labelText: "Max",
      colSpan: 2,
      disabled: true,
    },
  ],
  [
    {
      id: "parentQuestion",
      labelText: "Parent Question",
      colSpan: 8,
      type: "select",
      autoComplete: true,
      group: "parentQuestion",
    },
    {
      id: "optionLabel",
      labelText: "Parent Option",
      colSpan: 4,
      type: "select",
    },
  ],
  [
    {
      id: "htmlContent",
      labelText: "HTML Content",
      colSpan: 12,
      textArea: true,
    },
  ],
  [
    {
      id: "toolTip",
      labelText: "Tooltip",
      colSpan: 8,
    },
    {
      id: "number",
      labelText: "Number",
      colSpan: 2,
    },
    {
      id: "name",
      labelText: "Name",
      colSpan: 2,
    },
  ],
];

module.exports = {
  fields,
};
