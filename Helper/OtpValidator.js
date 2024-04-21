export const oneMinuteExpiry = (otpTime)=>{
    try {
        console.log('Timestamp is :- ',otpTime);
        const c_datetime =  new Date();
        var diffrenceValue = (c_datetime.getTime()-otpTime)/1000;
        diffrenceValue /=60;
        console.log('Expiry minute :-', diffrenceValue);
        if(diffrenceValue>1){
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}