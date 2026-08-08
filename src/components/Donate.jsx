import {
FaHeart,
FaHandHoldingHeart,
FaRupeeSign
} from "react-icons/fa";


function Donate(){

return(

<section
id="donate"
className="
py-24
bg-gradient-to-br
from-green-900
via-green-800
to-green-950
relative
overflow-hidden
"
>


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


<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-12
items-center
">



{/* Left */}

<div className="text-white">


<div className="
w-16
h-16
rounded-2xl
bg-orange-500
flex
items-center
justify-center
text-3xl
shadow-lg
">

<FaHeart/>

</div>




<h2 className="
text-4xl
md:text-5xl
font-bold
mt-6
leading-tight
">

आपका सहयोग
<br/>
किसी की जिंदगी बदल सकता है

</h2>




<p className="
text-green-100
mt-6
leading-8
text-lg
">

आपका छोटा सा योगदान शिक्षा, स्वास्थ्य,
पर्यावरण और समाज सेवा के कार्यों को आगे बढ़ाने में
मदद करेगा।

</p>




<div className="
mt-8
flex
items-center
gap-4
">

<div className="
w-14
h-14
bg-white/20
rounded-full
flex
items-center
justify-center
text-2xl
">

<FaHandHoldingHeart/>

</div>


<p className="text-white font-semibold">
#स्वार्थी नहीं सारथी बनो#
</p>


</div>


</div>







{/* Donation Card */}


<div className="
bg-white
rounded-[30px]
p-8
shadow-2xl
">


<h3 className="
text-2xl
font-bold
text-green-800
text-center
">

सहयोग करें

</h3>




<div className="
mt-6
bg-green-50
rounded-2xl
p-6
text-center
">


<div className="
w-20
h-20
mx-auto
bg-orange-500
rounded-full
flex
items-center
justify-center
text-white
text-4xl
">

<FaRupeeSign/>

</div>



<p className="
mt-5
text-gray-700
font-medium
">

दान राशि संस्था के सेवा कार्यों में उपयोग की जाएगी।

</p>



</div>





{/* UPI */}

<div className="
mt-6
border-2
border-dashed
border-green-200
rounded-2xl
p-5
text-center
">


<p className="
text-gray-500
">

UPI ID

</p>


<h4 className="
text-xl
font-bold
text-green-700
mt-2
">

yourupi@bank

</h4>



<p className="
text-sm
text-gray-500
mt-3
">

(अपनी UPI ID यहाँ डालें)

</p>


</div>





<button

className="
w-full
mt-6
bg-orange-500
text-white
py-4
rounded-xl
font-bold
text-lg
hover:bg-orange-600
hover:scale-105
transition
shadow-lg
"

>

❤️ अभी सहयोग करें

</button>



</div>


</div>


</div>


</section>


)

}


export default Donate;