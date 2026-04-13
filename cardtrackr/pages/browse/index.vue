<script setup>
    import TCGdex, { Query } from '@tcgdex/sdk'
    import {Combobox,ComboboxInput,ComboboxOptions,ComboboxOption, ComboboxButton,} from '@headlessui/vue'
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import nameMap from '~/assets/nameMap.json'

    gsap.registerPlugin(ScrollTrigger)     

    const client = useSupabaseClient();
    const user = useSupabaseUser();

    const tcgdex = new TCGdex('en');
    tcgdex.setCacheTTL(10);

    const renderData= ref(null);
    const cardName = ref("");
    const query = ref("")
    const wishlist = ref(null)
    const collection = ref(null);
    const visibleCards = ref([]);
    const cardsToShow = ref(50);
    
    const sets = [
        {code: null, name: 'Search Set'},
        { code: 'base%20set', name: 'Base Set' },
        { code: 'jungle', name: 'Jungle' },
        { code: 'fossil', name: 'Fossil' },
        { code: 'base2', name: 'Base Set 2' },
        { code: 'team%20rocket', name: 'Team Rocket' },
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
        { code: 'bw1', name: 'BW Black & White' },
        { code: 'bw2', name: 'BW Emerging Powers' },
        { code: 'bw3', name: 'BW Noble Victories' },
        { code: 'bw4', name: 'BW Next Destinies' },
        { code: 'bw5', name: 'BW Dark Explorers' },
        { code: 'bw6', name: 'BW Dragons Exalted' },
        { code: 'bw7', name: 'BW Boundaries Crossed' },
        { code: 'bw8', name: 'BW Plasma Storm' },
        { code: 'bw9', name: 'BW Plasma Freeze' },
        { code: 'bw10', name: 'BW Plasma Blast' },
        { code: 'bw11', name: 'Legendary Treasures' },
        { code: 'xy1', name: 'XY' },
        { code: 'xy2', name: 'XY Flashfire' },
        { code: 'xy3', name: 'XY Furious Fists' },
        { code: 'xy4', name: 'XY Phantom Forces' },
        { code: 'xy5', name: 'XY Primal Clash' },
        { code: 'xy6', name: 'XY Roaring Skies' },
        { code: 'xy7', name: 'XY Ancient Origins' },
        { code: 'xy8', name: 'XY BREAKthrough' },
        { code: 'xy9', name: 'XY BREAKpoint' },
        {code: 'generations', name: 'Generations'},
        { code: 'xy10', name: 'XY Fates Collide' },
        { code: 'xy11', name: 'XY Steam Siege' },
        { code: 'xy12', name: 'XY Evolutions' },
        { code: 'sm1', name: 'Sun & Moon' },
        { code: 'sm2', name: 'SM Guardians Rising' },
        { code: 'sm3', name: 'SM Burning Shadows' },
        {code: 'shining%20legends', name: 'Shining Legends'},
        { code: 'sm4', name: 'SM Crimson Invasion' },
        { code: 'sm5', name: 'SM Ultra Prism' },
        { code: 'sm6', name: 'SM Forbidden Light' },
        { code: 'sm7', name: 'SM Celestial Storm' },
        {code: 'dragon%20majesty', name: 'Dragon Majesty'},
        { code: 'sm8', name: 'SM Lost Thunder' },
        { code: 'sm9', name: 'SM Team Up' },
        {code: 'detective%20pikachu', name: 'Detective Pikachu'},
        { code: 'sm10', name: 'SM Unbroken Bonds' },
        { code: 'sm11', name: 'SM Unified Minds' },
        {code: 'hidden%20fates', name: 'Hidden Fates'},
        { code: 'sm12', name: 'SM Cosmic Eclipse' },
        { code: 'swsh1', name: 'SWSH Sword & Shield' },
        { code: 'swsh2', name: 'SWSH Rebel Clash' },
        { code: 'swsh3', name: 'SWSH Darkness Ablaze' },
        {code: 'champions%20path', name:'Champions Path'},
        { code: 'swsh4', name: 'SWSH Vivid Voltage' },
        {code: 'shining%20fates', name:'Shining Fates'},
        { code: 'swsh5', name: 'SWSH Battle Styles' },
        { code: 'swsh6', name: 'SWSH Chilling Reign' },
        { code: 'swsh7', name: 'SWSH Evolving Skies' },
        {code: 'celebrations', name:'Celebrations'},
        { code: 'swsh8', name: 'SWSH Fusion Strike' },
        { code: 'swsh9', name: 'SWSH Brilliant Stars' },
        { code: 'swsh10', name: 'SWSH Astral Radiance' },  
        { code: 'swsh11', name: 'SWSH Lost Origin' },
        { code: 'swsh12', name: 'SWSH Silver Tempest' },
        { code: 'swsh12.5', name: 'SWSH Crown Zenith' },
        { code: 'scarlet%20&%20violet', name: 'Scarlet & Violet' },
        { code: 'paldea%20evolved', name: 'SV Paldea Evolved' },
        { code: 'obsidian%20flames', name: 'SV Obsidian Flames' },
        { code: '151', name: 'SV 151' },
        { code: 'paradox%20rift', name: 'SV Paradox Rift' },
        {code: 'paldean%20fates', name: 'SV Paldean Fates'},
        { code: 'temporal%20forces', name: 'SV Temporal Forces' },
        { code: 'twilight%20masquerade', name: 'SV Twilight Masquerade' },
        { code: 'shrouded%20fable', name: 'SV Shrouded Fable' },
        { code: 'stellar%20crown', name: 'SV Stellar Crown' },
        {code: 'surging%20sparks', name: 'SV Surging Sparks'},
        {code: 'prismatic%20evolutioins', name: 'SV Prismatic Evolutions'},
        {code: 'journey%20together', name: 'SV Journey Together'},
        {code: 'destined%20rivals', name: 'SV Destined Rivals'},
        {code: 'black%20bolt', name: 'SV Black Bolt'},
        {code: 'white%20flare', name:'SV White Flare'},
        {code: 'mega%20evolution', name: 'Mega Evolution'}
    ]

    const selectedSet = ref(sets[0])
    const loadMoreTrigger = ref(null);
    const cardsContainer = ref(null);

    let observer = null; // außerhalb, damit wir ihn disconnect können

    const setupIntersectionObserver = () => {
        if (observer) observer.disconnect(); // ← alten Observer zerstören
        
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && visibleCards.value.length < (renderData.value?.cards?.length || 0)) {
                    loadMoreCards();
                }
            });
        }, {
            rootMargin: '200px'
        });

        if (loadMoreTrigger.value) {
            observer.observe(loadMoreTrigger.value);
        }
    };

    const animateCards = () => {
        nextTick(() => {
            const cards = cardsContainer.value?.querySelectorAll('.card-item');
            if (cards && cards.length > 0) {
                gsap.fromTo(cards, 
                    {
                        y: 50,
                        opacity: 0
                    },
                    {
                        duration: 0.3,
                        y: 0,
                        opacity: 1,
                        stagger: 0.1,
                        ease: "power2.out"
                    }
                );
            }
        });
    };

    const loadMoreCards = () => {
        if (!renderData.value?.cards) return;
        
        const currentLength = visibleCards.value.length;
        const nextBatch = renderData.value.cards.slice(
            currentLength, 
            currentLength + 20
        );
        
        visibleCards.value = [...visibleCards.value, ...nextBatch];
        
        nextTick(() => {
            const newCards = cardsContainer.value?.querySelectorAll('.card-item');
            if (newCards && newCards.length > currentLength) {
                const cardsToAnimate = Array.from(newCards).slice(currentLength);
                gsap.fromTo(cardsToAnimate,
                    {
                        y: 50,
                        opacity: 0
                    },
                    {
                        duration: 0.3,
                        y: 0,
                        opacity: 1,
                        stagger: 0.05,
                        ease: "power2.out"
                    }
                );
            }
        });
    }; 

    watch(() => renderData.value?.cards, (newCards) => {
        if (newCards) {
            cardsToShow.value = 50;
            visibleCards.value = newCards.slice(0, 20);
            animateCards();
            nextTick(() => {
                setupIntersectionObserver(); // ← neu aufsetzen nach Suchergebnis
            });
        }
    });

    onMounted(async () => {
        localStorage.clear();
        renderData.value = []
        await fetchCards();
        const data = await tcgdex.random.set();
        renderData.value = data;
        console.log(renderData.value)

        await nextTick();
        setupIntersectionObserver();
    })

    const fetchCards = async () => {
        try {
            const {data, error} = await client.from('wishlist').select('*').eq('user_id', user.value.sub);
            if (error) throw error
            wishlist.value = data || [];
        } catch (error) {
            console.log(error)
        }
        
        try {
            const {data, error} = await client.from('collection').select('*').eq('user_id', user.value.sub);
            if (error) throw error
            collection.value = data || [];
        } catch (error) {
            console.log(error);
        }
    }

    const search = async (name, selectedSet) => {
        if (!name && !selectedSet.code) {
            return;
        }

        if (name && name !== "") {
            const translatedName = nameMap[name.toLowerCase()] ?? name
            const data = await tcgdex.card.list(new Query().like('name', translatedName))
            renderData.value = { cards: data.cards || data }
            return;
        }

        if (selectedSet && selectedSet.code !== 'none') {
            const set = await tcgdex.fetch('sets', selectedSet.code);
            renderData.value = { cards: set.cards || set }; 
            return;
        }
    }

    const filteredSets = computed(() => 
        query.value === '' ? sets : sets.filter((set) => {
            return set.name.toLocaleLowerCase().includes(query.value.toLocaleLowerCase())
        })
    )
</script>

<template>
    <div class="flex flex-col items-center ">
        <div class="w-[80%] h-[16.5rem] md:h-[8.5rem] bg-zinc-900 border-[0.15rem] border-zinc-700 shadow-[0px_4px_13px_0px_rgba(0,_0,_0,_0.1)] mt-[5rem] lg:mt-[10rem] rounded-lg p-[1rem] z-10">
            <div class="text-neutral-300 font-bold text-[1.5rem] mb-[1rem]">Find cards</div>
            <div class="flex flex-col md:flex-row gap-[1rem]">
                <input v-model="cardName" type="text" placeholder="Name" class="bg-zinc-700 rounded-lg p-[0.5rem] h-[3rem] outline-none border-[0.15rem] border-zinc-600 focus:border-red-500"/>
                <div :class="[cardName ? 'opacity-30 pointer-events-none' : 'opacity-100']">
                    <Combobox v-model="selectedSet">
                        <div class="bg-zinc-700 h-[3rem] text-neutral-500 pl-[1rem] pt-[0.5rem] pr-[1rem] rounded-lg border-zinc-600 border-[0.15rem] ">
                            <ComboboxInput @change="query = $event.target.value" :display-value="(set) => set.name" class="bg-zinc-700 outline-none"/>
                            
                            <ComboboxButton>
                                <div  class="hover:bg-red-500 w-[1.5rem] h-[1.5rem] flex justify-center items-center rounded-lg group duration-75">
                                    <Icon name="fluent:chevron-up-down-24-filled" class="text-neutral-500 group-hover:bg-white duration-75"/>
                                </div>
                            </ComboboxButton>
                        </div>
                        <div class="bg-zinc-700 mt-[0.5rem] rounded-lg max-h-[15rem] overflow-auto text-neutral-500 absolute">
                            <ComboboxOptions class="">
                                <div>
                                    <ComboboxOption v-for="set in filteredSets" :key="set.code" :value="set" class=" hover:text-zinc-300 hover:bg-zinc-600 rounded-lg h-[1.75rem] pl-[0.5rem]" @click="dropDown = false">
                                        {{ set.name }}
                                    </ComboboxOption>
                                </div>
                            </ComboboxOptions>
                        </div>
                    </Combobox>
                </div>
                <div class="bg-red-500 h-[3rem] text-white md:w-[6rem] p-[0.5rem] flex justify-center items-center rounded-lg select-none cursor-pointer" @click="search(cardName, selectedSet)" v-motion="{
                    initial: {
                        scale: 1
                    },
                    hovered: {
                        scale: 1.1
                    },
                    tapped: {
                        scale: 0.9
                    }
                }">Search</div>
            </div>
        </div>
        <div class="font-bold text-[2rem] mt-[2rem] text-zinc-500">{{ renderData?.name }}</div>
        <div ref="cardsContainer" class="flex gap-[1rem] flex-wrap content-start items-center justify-center mt-[1rem] w-[95%] sm:w-[90%]">
            <CardPrev 
                v-if="wishlist && collection" 
                v-for="item in visibleCards" 
                :key="item.id" 
                :name="item.name" 
                :image="item.image" 
                :id="item.localId" 
                :globalID="item.id" 
                :wishlist="wishlist" 
                :collection="collection"
                class="card-item"
            />
            <div 
                v-if="visibleCards.length < (renderData?.cards?.length || 0)" 
                ref="loadMoreTrigger" 
                class="w-full h-[100px] flex items-center justify-center text-neutral-400"
            >
                loading cards...
            </div>    
        </div>                                     
    </div>
</template>