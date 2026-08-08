import {
FaBookOpen,
FaHeartbeat,
FaLeaf,
FaArrowRight
} from "react-icons/fa";


function About(){

const highlights=[
{
icon:<FaBookOpen/>,
title:"शिक्षा",
desc:"जरूरतमंद बच्चों और युवाओं को शिक्षा से जोड़ना।"
},
{
icon:<FaHeartbeat/>,
title:"स्वास्थ्य",
desc:"स्वास्थ्य जागरूकता और सहायता के लिए कार्य करना।"
},
{
icon:<FaLeaf/>,
title:"पर्यावरण",
desc:"स्वच्छता और पर्यावरण संरक्षण को बढ़ावा देना।"
}
];


return(

<section
id="about"
className="py-24 bg-white overflow-hidden"
>


<div className="max-w-7xl mx-auto px-5">


<div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">


{/* Image */}

<div className="relative">


<div className="
absolute
- top-5
-left-5
w-40
h-40
bg-orange-200
rounded-full
blur-3xl
">
</div>


<img

src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"

alt="NGO Work"

className="
relative
rounded-[30px]
shadow-2xl
w-full
h-[450px]
object-cover
"

 />



<div className="
absolute
bottom-6
right-6
bg-white
shadow-xl
rounded-2xl
px-6
py-4
">

<h3 className="text-3xl font-bold text-green-700">
#1
</h3>

<p className="text-gray-600">
सामाजिक सेवा
</p>

</div>


</div>





{/* Content */}

<div>


<span className="
text-orange-500
font-semibold
tracking-wider
">

हमारे बारे में

</span>



<h2 className="
text-4xl
md:text-5xl
font-bold
text-green-800
mt-4
leading-tight
">

युवा शक्ति से
<br/>

राष्ट्र निर्माण की ओर

</h2>



<p className="
mt-6
text-gray-600
leading-8
text-lg
">

युवा सारथी सेवा संस्था छत्तीसगढ़ एक सामाजिक संस्था है,
जो शिक्षा, स्वास्थ्य, स्वच्छता, पर्यावरण संरक्षण और
समानता के क्षेत्र में कार्य कर रही है।

</p>



<p className="
mt-4
text-gray-600
leading-8
">

हमारा उद्देश्य युवाओं को सेवा भावना से जोड़कर
एक मजबूत और विकसित समाज का निर्माण करना है।

</p>





<div className="
grid
grid-cols-1
sm:grid-cols-3
gap-5
mt-10
">


{
highlights.map((item,index)=>(


<div

key={index}

className="
bg-gray-50
p-5
rounded-2xl
hover:shadow-xl
hover:-translate-y-2
transition
duration-300
"


>


<div className="
text-3xl
text-orange-500
">

{item.icon}

</div>


<h3 className="
font-bold
text-xl
mt-4
">

{item.title}

</h3>


<p className="
text-gray-600
text-sm
mt-2
leading-6
">

{item.desc}

</p>


</div>


))

}


</div>





<a
href="#services"
className="
inline-flex
items-center
gap-2
mt-10
bg-green-700
text-white
px-7
py-3
rounded-full
font-semibold
hover:bg-green-800
transition
"

>

हमारी सेवाएँ देखें

<FaArrowRight/>

</a>



</div>


</div>


</div>


</section>


)

}


export default About;