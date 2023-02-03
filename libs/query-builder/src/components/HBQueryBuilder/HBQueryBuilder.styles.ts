import { Box, styled } from '@mui/material'

export const HBQueryBuilderStyle = styled(Box)(
  ({ theme: { palette } }) => `
    & .ruleGroup-header{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        margin-top: 10px;
        min-height: 50px;
    }
    & .ruleGroup {
      background-color: ${palette.common.white}; 
    };
    & .ruleGroup .rule{
        background-color: #fff;
        border-left: 4px solid #00bcd4;
        padding: 10px;
        min-height: 60px;
        margin-bottom: 10px;
        margin-right: 7px;
    };
    & .ruleGroup, .ruleGroup .ruleGroup, .ruleGroup .rule {
        border-radius: 4px;
        padding-left: 5px;
      };
    & .ruleGroup .ruleGroup {
      background-color: ${palette.grey[200]};
        border: 2px solid #8bc34a;
        margin-bottom: 10px;
      };
    & .ruleGroup-combinators,
    .ruleGroup-addRule,
    .ruleGroup-addGroup,
    .rule-fields,
    .rule-operators,
    .rule-value {
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 6px 12px;
    };
    & .ruleGroup-remove, .rule-remove {
        background: transparent;
        border: none;
      };
    & .queryBuilder-dragHandle {
        display: none;
    };
    `,
)
