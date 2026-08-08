import {
FaUserTie,
FaQuoteLeft
} from "react-icons/fa";


function Founder(){


const founders=[

{
name:"नोकेश कुमार मधुकर",
role:"संस्थापक",
image:"/images/founder1.jpg",
quote:"समाज सेवा और युवा शक्ति के माध्यम से राष्ट्र निर्माण का संकल्प।"
},

{
name:"गजेंद्र सिंह ठाकुर",
role:"सह संस्थापक",
image:"/images/founder2.jpg",
quote:"समानता, सम्मान और सेवा भावना को आगे बढ़ाना।"
}

];



return(

<section
className="
py-24
bg-gray-50
"
>


<div className="
max-w-7xl
mx-auto
px-5
">


<div className="text-center">


<span className="
text-orange-500
font-semibold
tracking-widest
">

हमारे मार्गदर्शक

</span>



<h2 className="
text-4xl
md:text-5xl
font-bold
text-green-800
mt-4
">

संस्थापक मंडल

</h2>


<p className="
text-gray-600
mt-4
max-w-2xl
mx-auto
">

संस्था को दिशा देने वाले हमारे प्रमुख सदस्य।

</p>


</div>





<div className="
grid
grid-cols-1
md:grid-cols-2
gap-10
mt-14
max-w-5xl
mx-auto
">



{
founders.map((item,index)=>(


<div

key={index}

className="
bg-white
rounded-[30px]
p-8
shadow-md
hover:shadow-2xl
transition-all
duration-500
hover:-translate-y-3
text-center
relative
overflow-hidden
"

>


{/* Top Design */}

<div className="
absolute
top-0
left-0
w-full
h-2
bg-gradient-to-r
from-green-700
to-orange-500
">

</div>




<img

src={item.image}

alt={item.name}

className="
w-32
h-32
rounded-full
object-cover
mx-auto
mt-3
border-4
border-green-100
shadow-lg
"

onError={(e)=>{
e.currentTarget.style.display="none";
}}

/>




<div className="
w-32
h-32
rounded-full
bg-green-100
mx-auto
mt-3
flex
items-center
justify-center
text-5xl
text-green-700
"

>

<FaUserTie/>

</div>




<h3 className="
text-2xl
font-bold
mt-6
text-gray-800
">

{item.name}

</h3>



<span className="
inline-block
mt-3
bg-orange-500
text-white
px-5
py-2
rounded-full
font-semibold
">

{item.role}

</span>




<div className="
mt-6
bg-gray-50
p-5
rounded-2xl
text-gray-600
leading-7
">


<FaQuoteLeft
className="
text-orange-500
text-xl
mb-2
mx-auto
"
/>


{item.quote}


</div>



</div>


))

}



</div>


</div>


</section>


)

}


export default Founder;