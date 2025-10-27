<script setup>

    import TCGdex, { Query } from '@tcgdex/sdk'
    import {Combobox,ComboboxInput,ComboboxOptions,ComboboxOption, ComboboxButton,} from '@headlessui/vue'
    import { gsap } from "gsap";


    const tcgdex = new TCGdex('en');

    const renderData= ref(null);
    const cardName = ref("");
    const query = ref("")
    


    const sets = [
        {code: null, name: 'Search Set'},
        { code: 'base%20set', name: 'Base Set' },
        { code: 'jungle', name: 'Jungle' },
        { code: 'fossil', name: 'Fossil' },
        { code: 'base2', name: 'Base Set 2' },
        { code: 'teamrocket', name: 'Team Rocket' },
        { code: 'gym1', name: 'Gym Heroes' },
        { code: 'gym2', name: 'Gym Challenge' },
        { code: 'neo1', name: 'Neo Genesis' },
        { code: 'neo2', name: 'Neo Discovery' },
        { code: 'neo3', name: 'Neo Revelation' },
        { code: 'neo4', name: 'Neo Destiny' },
        {code: 'legendary%20collection', name: 'Legendary Collection'},
        { code: 'expedition', name: 'Expedition Base Set' },
        { code: 'aquapolis', name: 'Aquapolis' },
        { code: 'skyridge', name: 'Skyridge' },
        { code: 'ex1', name: 'EX Ruby & Sapphire' },
        { code: 'ex2', name: 'EX Sandstorm' },
        { code: 'ex3', name: 'EX Dragon' },
        { code: 'ex4', name: 'EX Team Magma vs Team Aqua' },
        { code: 'ex5', name: 'EX Hidden Legends' },
        { code: 'ex6', name: 'EX FireRed & LeafGreen' },
        { code: 'ex7', name: 'EX Team Rocket Returns' },
        { code: 'ex8', name: 'EX Deoxys' },
        { code: 'ex9', name: 'EX Emerald' },
        { code: 'ex10', name: 'EX Unseen Forces' },
        { code: 'ex11', name: 'EX Delta Species' },
        { code: 'ex12', name: 'EX Legend Maker' },
        { code: 'ex13', name: 'EX Holon Phantoms' },
        { code: 'ex14', name: 'EX Crystal Guardians' },
        { code: 'ex15', name: 'EX Dragon Frontiers' },
        { code: 'ex16', name: 'EX Power Keepers' },
        { code: 'dp1', name: 'Diamond & Pearl' },
        { code: 'dp2', name: 'D&P Mysterious Treasures' },
        { code: 'dp3', name: 'D&P Secret Wonders' },
        { code: 'dp4', name: 'D&P Great Encounters' },
        { code: 'dp5', name: 'D&P Majestic Dawn' },
        { code: 'dp6', name: 'D&P Legends Awakened' },
        { code: 'dp7', name: 'D&P Stormfront' },
        { code: 'pl1', name: 'Platinum' },
        { code: 'pl2', name: 'Platinum Rising Rivals' },
        { code: 'pl3', name: 'Platinum Supreme Victors' },
        { code: 'pl4', name: 'Platinum Arceus' },
        { code: 'hgss1', name: 'HeartGold & SoulSilver' },
        { code: 'hgss2', name: 'H&S Unleashed' },
        { code: 'hgss3', name: 'H&S Undaunted' },
        { code: 'hgss4', name: 'H&S Triumphant' },
        { code: 'col', name: 'Call of Legends' },
        { code: 'bw1', name: 'Black & White' },
        { code: 'bw2', name: 'Emerging Powers' },
        { code: 'bw3', name: 'Noble Victories' },
        { code: 'bw4', name: 'Next Destinies' },
        { code: 'bw5', name: 'Dark Explorers' },
        { code: 'bw6', name: 'Dragons Exalted' },
        { code: 'bw7', name: 'Boundaries Crossed' },
        { code: 'bw8', name: 'Plasma Storm' },
        { code: 'bw9', name: 'Plasma Freeze' },
        { code: 'bw10', name: 'Plasma Blast' },
        { code: 'bw11', name: 'Legendary Treasures' },
        { code: 'xy1', name: 'XY' },
        { code: 'xy2', name: 'Flashfire' },
        { code: 'xy3', name: 'Furious Fists' },
        { code: 'xy4', name: 'Phantom Forces' },
        { code: 'xy5', name: 'Primal Clash' },
        { code: 'xy6', name: 'Roaring Skies' },
        { code: 'xy7', name: 'Ancient Origins' },
        { code: 'xy8', name: 'BREAKthrough' },
        { code: 'xy9', name: 'BREAKpoint' },
        {code: 'generations', name: 'Generations'},
        { code: 'xy10', name: 'Fates Collide' },
        { code: 'xy11', name: 'Steam Siege' },
        { code: 'xy12', name: 'Evolutions' },
        { code: 'sm1', name: 'Sun & Moon' },
        { code: 'sm2', name: 'Guardians Rising' },
        { code: 'sm3', name: 'Burning Shadows' },
        {code: 'shining%20legends', name: 'Shining Legends'},
        { code: 'sm4', name: 'Crimson Invasion' },
        { code: 'sm5', name: 'Ultra Prism' },
        { code: 'sm6', name: 'Forbidden Light' },
        { code: 'sm7', name: 'Celestial Storm' },
        {code: 'dragon%20majesty', name: 'Dragon Majesty'},
        { code: 'sm8', name: 'Lost Thunder' },
        { code: 'sm9', name: 'Team Up' },
        {code: 'detective%20pikachu', name: 'Detective Pikachu'},
        { code: 'sm10', name: 'Unbroken Bonds' },
        { code: 'sm11', name: 'Unified Minds' },
        {code: 'hidden%20fates', name: 'Hidden Fates'},
        { code: 'sm12', name: 'Cosmic Eclipse' },
        { code: 'swsh1', name: 'Sword & Shield' },
        { code: 'swsh2', name: 'Rebel Clash' },
        { code: 'swsh3', name: 'Darkness Ablaze' },
        {code: 'champions%20path', name:'Champions Path'},
        { code: 'swsh4', name: 'Vivid Voltage' },
        {code: 'shining%20fates', name:'Shining Fates'},
        { code: 'swsh5', name: 'Battle Styles' },
        { code: 'swsh6', name: 'Chilling Reign' },
        { code: 'swsh7', name: 'Evolving Skies' },
        {code: 'celebrations', name:'Celebrations'},
        { code: 'swsh8', name: 'Fusion Strike' },
        { code: 'swsh9', name: 'Brilliant Stars' },
        { code: 'swsh10', name: 'Astral Radiance' },  
        { code: 'swsh11', name: 'Lost Origin' },
        { code: 'swsh12', name: 'Silver Tempest' },
        { code: 'swsh12.5', name: 'Crown Zenith' },
        { code: 'sv1', name: 'Scarlet & Violet' },
        { code: 'sv2', name: 'Paldea Evolved' },
        { code: 'sv3', name: 'Obsidian Flames' },
        { code: 'sv151', name: 'Scarlet & Violet 151' },
        { code: 'sv4', name: 'Paradox Rift' },
        {code: 'sv4.5', name: 'Paldean Fates'},
        { code: 'sv5', name: 'Temporal Forces' },
        { code: 'sv6', name: 'Twilight Masquerade' },
        { code: 'sv7', name: 'Shrouded Fable' },
        { code: 'sv8', name: 'Stellar Crown' },
        {code: 'me1', name: 'Mega Evolution'}
    ]

    const selectedSet = ref(sets[0])

    const growText = (e) => {
        gsap.to(e.target, {
            scale: 1.1,
            duration: 0.1,
            ease: "power2.out"
        });
    };

    const shrinkText = (e) => {
        gsap.to(e.target, {
            scale: 1,
            duration: 0.1,
            ease: "power2.out"
        });
    };

    const tapButton = (e) => {
        gsap.to(e.target, {
            scale: 0.9,
            duration: 0.1,
            ease: "power2.out"
        });
    }

    onMounted(async () => {
        renderData.value = []
        const data = await tcgdex.random.set();
        renderData.value = data;

    })


    const search = async (name, selectedSet) => {    
        if(name && selectedSet.code != null) {
            const data = await tcgdex.card.list(new Query()
                .like('name', name)
                .equal('set', selectedSet)
            );
            renderData.value = { cards: data.cards || data }; 
           
        } else if (selectedSet) {
            const set = await tcgdex.fetch('sets', selectedSet.code);
            renderData.value = { cards: set.cards || data }; 
        } else if (name) {
            const data = await tcgdex.card.list(new Query().like('name', name));
            renderData.value = { cards: data.cards || data }; 
        }

        console.log(renderData.value);
    }

    const filteredSets = computed(() => 
        query.value === '' ? sets : sets.filter((set) => {
            return set.name.toLocaleLowerCase().includes(query.value.toLocaleLowerCase())
        })
    )



</script>

<template>
    <div class="flex flex-col items-center">
        <div class="w-[80%] h-[10rem] bg-white shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] mt-[10rem] rounded-lg p-[1rem] z-10">
            <div class="text-neutral-300 font-bold text-[1.5rem] mb-[1rem]">Karten suchen{{ selectedSet }}</div>
            <div class="flex flex-row gap-[1rem]">
                <input v-model="cardName" type="text" placeholder="Name" class="bg-neutral-100 rounded-lg p-[0.5rem] h-[3rem] outline-none border-[0.15rem] border-neutral-200 focus:border-red-500"/>
                <div>
                    <Combobox v-model="selectedSet">
                        <div class="bg-neutral-100 h-[3rem] text-neutral-500 pl-[1rem] pt-[0.5rem] pr-[1rem] rounded-lg border-neutral-200 border-[0.15rem] ">
                            <ComboboxInput @change="query = $event.target.value" class="bg-neutral-100 outline-none"/>
                            <ComboboxButton>
                                <div  class="hover:bg-red-500 w-[1.5rem] h-[1.5rem] flex justify-center items-center rounded-lg group duration-75">
                                    <Icon name="fluent:chevron-up-down-24-filled" class="text-neutral-500 group-hover:bg-white duration-75"/>
                                </div>

                            </ComboboxButton>
                        </div>
                        <div class="bg-neutral-100 mt-[0.5rem] rounded-lg max-h-[15rem] overflow-auto text-neutral-500">
                            <ComboboxOptions>
                                <div>
                                    <ComboboxOption v-for="set in filteredSets" :key="set" :value="set" class=" hover:text-neutral-700 hover:bg-neutral-200 rounded-lg h-[1.75rem] pl-[0.5rem]" @click="dropDown = false">
                                        {{ set.name }}
                                    </ComboboxOption>
                                </div>

                            </ComboboxOptions>
                        </div>

                    </Combobox>
                </div>
                <div class="bg-red-500 h-[3rem] text-white w-[6rem] p-[0.5rem] flex justify-center items-center rounded-lg select-none cursor-pointer" @click="search(cardName, selectedSet)" @mouseenter="growText" @mouseleave="shrinkText" @mousedown="tapButton" @mouseup="growText">Suchen</div>
            </div>
        </div>
        <div class="flex gap-[1rem] flex-wrap content-start items-center justify-center mt-[3rem] w-[80%]">
            <CardPrev v-for="card in renderData?.cards || []" :key="card.id" :name="card.name" :image="card.image" :id="card.localId"/>

        </div>                                     
    </div>
    
</template>