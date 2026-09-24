from app.schemas.brand_state import BrandState, BrandVoiceState, GuardianState, LaunchContentState, VisualIdentityState
from app.services.llm_service import LLMService


def visual(state: BrandState) -> VisualIdentityState:
    selected = state.selected_direction
    territory = selected.strategic_territory if selected else "community / crew"
    fallback = VisualIdentityState(
        color_palette=["Deep ink #1D2924", "Signal orange #F36B3B", "Soft mint #CBE8D8", "Warm paper #F7F8F3"],
        typography=["Expressive grotesk for headlines", "Compact mono for labels", "Readable humanist sans for body copy"],
        imagery_style="Real people making progress together, captured in candid motion.",
        composition=f"Open, editorial compositions with a clear focal point and {territory.lower()} energy.",
        symbols=["Relay marks", "Connected paths", "Small directional arrows"],
        ui_direction="Warm signal colors, crisp borders, and generous space around decisions.",
        things_to_avoid=["Stock corporate scenes", "Generic gradients", "Overly competitive visual cues"],
    )
    raw = LLMService().complete_json("Visual Identity Agent", {"discovery": state.discovery.model_dump(), "positioning": state.positioning.model_dump(), "personality": state.personality.model_dump(), "selected_direction": selected.model_dump() if selected else {}}, fallback.model_dump())
    return VisualIdentityState.model_validate(raw)


def voice(state: BrandState) -> BrandVoiceState:
    fallback = BrandVoiceState(
        tone="Direct, warm, useful, and quietly confident.", vocabulary=["crew", "make", "ship", "right fit", "next move"], sentence_style="Short active sentences with a human invitation.", writing_rules=["Lead with the useful outcome", "Use active verbs", "Invite before you impress", "Name the friction plainly"], words_to_use=["find", "build", "together", "ready", "move"], words_to_avoid=["seamless", "comprehensive", "leverage", "solution"], example_headline=state.selected_direction.tagline_direction if state.selected_direction else "Good ideas need the right room.", example_product_description=state.positioning.value_proposition, example_social_post="Your next build gets better when the right people are in the room.", example_cta="Find your people")
    raw = LLMService().complete_json("Brand Voice Agent", {"positioning": state.positioning.model_dump(), "personality": state.personality.model_dump(), "selected_direction": state.selected_direction.model_dump() if state.selected_direction else {}}, fallback.model_dump())
    return BrandVoiceState.model_validate(raw)


def launch(state: BrandState) -> LaunchContentState:
    direction = state.selected_direction
    name = state.final_brand.name if state.final_brand else (direction.sample_names[0] if direction else state.project.name)
    tagline = direction.tagline_direction if direction else "Make the next move together."
    fallback = LaunchContentState(headline=tagline, subheadline=state.positioning.value_proposition, one_line_pitch=f"{name} helps {state.positioning.target_audience.lower()} make the right next move.", product_description=state.positioning.positioning_statement, social_post=f"Meet {name}: {tagline} Find your next move with people who get it.", cta="Find your people")
    raw = LLMService().complete_json("Launch Content Agent", {"brand": state.final_brand.model_dump() if state.final_brand else {}, "voice": state.brand_voice.model_dump(), "positioning": state.positioning.model_dump()}, fallback.model_dump())
    return LaunchContentState.model_validate(raw)


def guardian(state: BrandState, content: str) -> GuardianState:
    voice = state.brand_voice
    generic = any(word in content.lower() for word in ("comprehensive", "seamless", "leverage", "solution"))
    fallback = GuardianState(content=content, overall_evaluation="Revise: the message is understandable but loses the selected brand's human, specific signal." if generic else "Keep: the message is aligned with the established brand system.", audience_fit=6 if generic else 9, positioning_alignment=7 if generic else 9, personality_alignment=5 if generic else 9, voice_alignment=4 if generic else 9, genericity_risk=8 if generic else 2, problems=["Generic corporate vocabulary", "Weak audience signal"] if generic else [], explanation="The selected voice asks for active, human language tied to a concrete next move.", recommendations=[f"Use words such as {', '.join(voice.words_to_use[:3])}.", "Replace abstract claims with a specific user outcome."] if generic else ["Keep the concrete audience and outcome visible."], improved_version=f"{state.project.name}: {voice.example_cta}. {state.positioning.value_proposition}" if generic else content)
    raw = LLMService().complete_json("Brand Guardian Agent", {"content": content, "brand_state": state.model_dump()}, fallback.model_dump())
    return GuardianState.model_validate(raw)