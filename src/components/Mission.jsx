import {
FaBullseye,
FaEye,
FaLightbulb,
FaQuoteLeft
} from "react-icons/fa";


function Mission(){

const cards=[

{
icon:<FaBullseye/>,
title:"हमारा उद्देश्य",
desc:"शिक्षा, स्वास्थ्य, स्वच्छता, पर्यावरण संरक्षण और सामाजिक समानता के माध्यम से बेहतर समाज का निर्माण करना।"
},

{
icon:<FaEye/>,
title:"हमारी सोच",
desc:"युवा शक्ति को सकारात्मक दिशा देकर राष्ट्र निर्माण में भागीदार बनाना।"
},

{
icon:<FaLightbulb/>,
title:"हमारा संकल्प",
desc:"सम्मान, स्वाभिमान और सेवा भावना से समाज में बदलाव लाना।"
}

];


return(

<section
className="
py-24
bg-white
"
>


<div className="
max-w-7xl
mx-auto
px-5
">


<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-12
items-center
">



{/* Left Content */}

<div>


<span className="
text-orange-500
font-semibold
tracking-widest
">

हमारा मिशन

</span>



<h2 className="
text-4xl
md:text-5xl
font-bold
text-green-800
mt-4
leading-tight
">

युवा उत्थान से
<br/>
राष्ट्र निर्माण

</h2>



<p className="
text-gray-600
mt-6
leading-8
text-lg
">

युवा सारथी सेवा संस्था छत्तीसगढ़ का उद्देश्य
युवाओं को सेवा, समानता और जिम्मेदारी की भावना से
जोड़कर एक विकसित समाज का निर्माण करना है।

</p>




<div className="
mt-8
bg-green-50
p-6
rounded-3xl
border-l-4
border-orange-500
">


<FaQuoteLeft
className="
text-orange-500
text-3xl
"
/>


<p className="
mt-3
text-xl
font-semibold
text-green-800
">

"#स्वार्थी नहीं सारथी बनो#"

</p>


</div>


</div>





{/* Right Cards */}

<div className="
space-y-5
">


{
cards.map((item,index)=>(


<div

key={index}

className="
group
bg-gray-50
p-6
rounded-3xl
flex
gap-5
items-start
hover:bg-green-700
hover:text-white
transition-all
duration-500
hover:-translate-x-2
"


>


<div className="
w-14
h-14
rounded-2xl
bg-orange-100
text-orange-500
flex
items-center
justify-center
text-2xl
group-hover:bg-white
transition
">

{item.icon}

</div>




<div>


<h3 className="
text-2xl
font-bold
">

{item.title}

</h3>


<p className="
mt-2
text-gray-600
group-hover:text-green-100
leading-7
">

{item.desc}

</p>


</div>



</div>


))

}



</div>


</div>


</div>


</section>

)

}


export default Mission;