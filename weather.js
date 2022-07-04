const form = document.querySelector(".top-banner form")
const input = document.querySelector("div.container input")
const msg = document.querySelector("span.msg")
const cityList  = document.querySelector(".ajax-section .cities")

localStorage.setItem("apiKey", EncryptStringAES("de7c20e25ebddc9712d2095cb575a53b") )


form.addEventListener("submit", (e)=>{
    e.preventDefault();
    getWeatherDatafromApi();
})

const getWeatherDatafromApi = async() =>{
    let apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
    let inputValue = input.value;
    let units = "metric";
    let lang = "de";
    //let mode = "xml"

    let url =  `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=${units}&lang=${lang}`; //!search params bak/windows.location.params
    try {
        const response = await axios(url)
        //console.log(response);
        const {main, name, sys, weather} = response.data;
        //image url
        const iconUrl = `https://openweathermap.org/img/wn/${
            weather[0].icon}@2x.png`;
        
        let cityCardList = cityList.querySelectorAll(".city");
        let cityCardListArray = Array.from(cityCardList);
        if(cityCardListArray.length>0){
            const filteredArray = cityCardListArray.filter(card=>card.querySelector(".city-name span").innerText == name);
            if(filteredArray.length > 0){
                msg.innerText = `You already know the weather fir ${name}, Please search another for city 😉`;
                setTimeout(()=>{
                    msg.innerText = "";
                }, 5000);
                form.reset();
                input.focus();
                return;
            }
        }


        let createdCityCardli = document.createElement("li");
        createdCityCardli.classList.add("city");
        createdCityCardli.innerHTML = `
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup> ${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
                <img class="city-icon" src="${iconUrl}">
                <figcaption>${weather[0].description}</figcaption>
            </figure>`;
        cityList.prepend(createdCityCardli)
        //! form.reset ==> input.value = ""; normalde böyle olmasi gerekiyor ama asagidaki gibi form ile bütün inputlarin icini bosaltir
    
        form.reset();
        input.focus(); //! enterdan sonra inputa focuslanir


    } catch (error) {
        msg.innerText = error;
        setTimeout(()=>{
            msg.innerText = "";
        }, 5000);
    }
}