//npm
import React from "react";
import _ from "lodash";

//internals
import GridContainer from "components/Internals/Grid/GridContainer";
import GridItem from "components/Internals/Grid/GridItem";

//my components
import GridOptions from "components/QuestionManage/options/gridOptions";
import GridSubQuestion from "components/QuestionManage/gridSubQuestion";

//views
import TableQuestion from "views/TableQuestions";

function QuestionManageGrids({
  isNewQuestion,
  onNewSubQuestion,
  showNewTemplateAlert,
  onResponseType,
  onQuestionId,
  isQuestionCell,
  history,
  values
}) {
  const responseTypeId = onResponseType();

  const questionId = onQuestionId();

  const sectionId = _.find(values.toJS(), { id: "sectionNameId" }).value;

  //If Group, it cannot have Options so we shall overwrite this instead.
  const forceDisableIfResponseTypeGroup =
    responseTypeId === 12 ? true : isNewQuestion;

  return (
    <GridContainer>
      {responseTypeId === 6 ? (
        <GridItem xs={44} sm={22} md={12}>
          <TableQuestion questionId={questionId} history={history} />
        </GridItem>
      ) : responseTypeId === 0 /*none*/ ||
        responseTypeId === 1 /*singletext*/ ||
        responseTypeId === 2 /*date*/ ||
        responseTypeId === 5 /*number*/ ||
        responseTypeId === 10 /*multitext*/ ||
        responseTypeId === 11 /*currency*/ ||
        responseTypeId === 13 /*date mm_yy*/ ? (
        <div />
      ) : (
        <React.Fragment>
          <GridItem xs={3} sm={6} md={4}>
            <GridOptions
              isNewQuestion={forceDisableIfResponseTypeGroup}
              dataValues={values}
            />
          </GridItem>
          {isQuestionCell ? (
            <span />
          ) : (
            <GridItem xs={3} sm={6} md={8}>
              <GridSubQuestion
                isNewQuestion={isNewQuestion}
                onNewSubQuestion={onNewSubQuestion}
                showNewTemplateAlert={showNewTemplateAlert}
                sectionId={sectionId}
              />
            </GridItem>
          )}
        </React.Fragment>
      )}
    </GridContainer>
  );
}

export default QuestionManageGrids;
