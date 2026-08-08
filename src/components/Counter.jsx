import {
FaUsers,
FaMapMarkedAlt,
FaHandsHelping,
FaLeaf
} from "react-icons/fa";


function Counter(){


const data=[

{
icon:<FaUsers/>,
number:"500+",
title:"जुड़े हुए सदस्य"
},

{
icon:<FaMapMarkedAlt/>,
number:"10+",
title:"छत्तीसगढ़ के जिले"
},

{
icon:<FaHandsHelping/>,
number:"50+",
title:"सेवा अभियान"
},

{
icon:<FaLeaf/>,
number:"100+",
title:"पर्यावरण कार्य"
}

];



return(

<section className="
py-20
bg-gradient-to-r
from-green-900
via-green-800
to-green-900
relative
overflow-hidden
">


{/* Background Circle */}

<div className="
absolute
w-96
h-96
bg-orange-500/20
rounded-full
blur-3xl
top-0
right-0
">
</div>



<div className="
max-w-7xl
mx-auto
px-5
relative
z-10
">


<div className="text-center text-white">


<p className="
text-orange-400
font-semibold
tracking-widest
">

हमारा प्रभाव

</p>


<h2 className="
text-4xl
md:text-5xl
font-bold
mt-3
">

सेवा के कुछ आंकड़े

</h2>


<p className="
text-green-100
mt-4
max-w-2xl
mx-auto
">

समाज में सकारात्मक बदलाव लाने के लिए हमारा निरंतर प्रयास।

</p>


</div>





<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
mt-12
">


{
data.map((item,index)=>(


<div
key={index}

className="
bg-white/10
backdrop-blur-lg
border
border-white/20
rounded-3xl
p-8
text-center
text-white
hover:bg-white/20
hover:-translate-y-3
transition-all
duration-500
"

>


<div className="
w-16
h-16
mx-auto
rounded-full
bg-orange-500
flex
items-center
justify-center
text-3xl
shadow-lg
">

{item.icon}

</div>



<h3 className="
text-4xl
font-bold
mt-5
">

{item.number}

</h3>



<p className="
text-green-100
mt-2
">

{item.title}

</p>



</div>


))

}


</div>


</div>


</section>


)

}


export default Counter;