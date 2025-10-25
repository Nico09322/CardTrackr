<script setup>

    import TCGdex, { Query } from '@tcgdex/sdk'

    const tcgdex = new TCGdex('en');

    const renderData= ref(null);
    const cardName = ref("");

    onMounted(async () => {
        renderData.value = []
        const data = await tcgdex.random.set();
        renderData.value = data;

    })

    const search = async (name) => {    
        const data = await tcgdex.card.list(new Query().like('name', name));
        renderData.value = { cards: data.cards || data };
        console.log(renderData.value);
    }


</script>

<template>
    <div class="flex flex-col items-center">
        <div class="w-[80%] h-[10rem] bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] mt-[10rem] rounded-lg p-[1rem]">
            <div class="text-neutral-300 font-bold text-[1.5rem] mb-[1rem]">Karten suchen</div>
            <div class="flex flex-row gap-[1rem]">
                <input v-model="cardName" type="text" placeholder="Name" class="bg-neutral-100 rounded-lg p-[0.5rem] outline-none border-[0.15rem] border-neutral-200 focus:border-red-500"/>
                <div class="bg-red-500 text-white w-[6rem] p-[0.5rem] flex justify-center items-center rounded-lg select-none cursor-pointer" @click="search(cardName)">Suchen</div>
            </div>
        </div>
        <div class="flex gap-[1rem] flex-wrap content-start items-center justify-center mt-[3rem] w-[80%]">
            <CardPrev v-for="card in renderData?.cards || []" :key="card.id" :name="card.name" :image="card.image" :id="card.localId"/>

        </div>                                     
    </div>
    
</template>