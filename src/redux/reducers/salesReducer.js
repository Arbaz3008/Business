const initialState = {
    totalSales: 1000,
    conversionRate: 5,
    leadSources: ['Website', 'Referral', 'Ads'],
  };
  
  const salesReducer = (state = initialState, action) => {
    switch (action.type) {
      default:
        return state;
    }
  };
  
  export default salesReducer;