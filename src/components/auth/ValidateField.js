export function SignupValidateField(name, value) {
     
    /*
        정규표현식으로 조건을 검사합니다. 공백 불포함, 
        이메일은 정규식 표현이 복잡하고 비효율적이므로 따로 조건식에 추가했습니다.
    */
    const accountIdRegax = /^[^\s]{4,32}$/;
    const passwordRegax = /^[^\s]{8,}$/;
    const nicknameRegax = /^[^\s]{2,9}$/;
    const emailRegax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    switch (name){

        case "accountId" :
            return accountIdRegax.test(value) ? "" : "아이디는 4자 이상이 필요합니다.(공백 미포함)";
        case "password" :
            return passwordRegax.test(value) ? "" : "비밀번호는 반드시 8자 이상이어야합니다.";
        case "nickname" :
            return nicknameRegax.test(value) ? "" : "닉네임을 입력하세요.(2~9자)";
        case "email" :
            return (emailRegax.test(value) && (value.length <= 254)) ? "" : "올바른 이메일 형식이 아닙니다.";
        default :
            return "";

    }

}


export function LoginValidateField(name, value) {
     
    /*
        정규표현식으로 조건을 검사합니다. 공백 불포함, 
        이메일은 정규식 표현이 복잡하고 비효율적이므로 따로 조건식에 추가했습니다.
    */
    const accountIdRegax = /^[^\s]{4,32}$/;
    const passwordRegax = /^[^\s]{8,}$/;


    switch (name){

        case "accountId" :
            return accountIdRegax.test(value) ? "" : "아이디는 4자 이상이 필요합니다.(공백 미포함)";
        case "password" :
            return passwordRegax.test(value) ? "" : "비밀번호는 반드시 8자 이상이어야합니다.";
        default :
            return "";

    }

}