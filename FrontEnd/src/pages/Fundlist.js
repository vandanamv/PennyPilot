import PropTypes from "prop-types";

const FundList = ({ funds }) => (
  <div className="fund-list">
    {funds.map((fund, index) => (
      <div key={index} className="fund-item">
        <div>{fund.AMC}</div>
        <div>{fund["Scheme Category"]}</div>
        <div>{fund["Risk Level"]}</div>
      </div>
    ))}
  </div>
);

FundList.propTypes = {
  funds: PropTypes.array.isRequired,
};

export default FundList;
