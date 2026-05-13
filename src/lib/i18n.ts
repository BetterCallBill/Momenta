export type Locale = "en" | "zh";

export const translations = {
  en: {
    nav: {
      home: "Home",
      events: "Events",
      calendar: "Calendar",
      gallery: "Gallery",
      partners: "Partners",
      about: "About",
      contact: "Contact",
      register: "Register Now",
    },
    hero: {
      cta_events: "View This Week's Events",
      cta_join: "Join Us",
    },
    footer: {
      tagline: "Sydney's most active Chinese outdoor community.",
      rights: "All rights reserved.",
    },
    common: {
      back_to_events: "Back to Events",
      spots_left: (n: number) => `${n} spots left`,
      event_full: "Full",
      free: "Free",
      register_now: "Register Now",
      featured: "Featured",
      no_events: "No events this month",
    },
    wechat: {
      login_button: "Login with WeChat",
      logging_in: "Opening WeChat…",
      logout: "Sign out",
      logged_in_as: "Signed in as",
      login_to_register: "Sign in with WeChat to pre-fill your details",
      skip_login: "Continue without WeChat",
    },
    register: {
      title: "Register",
      wechat_name: "WeChat Name",
      wechat_name_placeholder: "Your WeChat display name",
      wechat_prefilled: "Pre-filled from WeChat",
      name: "Full Name",
      name_placeholder: "Your full name",
      age: "Age",
      age_placeholder: "e.g. 28",
      email: "Email",
      email_placeholder: "you@example.com",
      phone: "Phone",
      phone_placeholder: "04xx xxx xxx",
      gender: "Gender",
      gender_male: "Male",
      gender_female: "Female",
      gender_other: "Other",
      gender_prefer_not: "Prefer not to say",
      notes: "Notes",
      notes_placeholder: "Dietary requirements, experience level, etc.",
      required: "Required fields marked *",
      submit: "Register",
      submitting: "Registering…",
      success_title: "You're registered!",
      success_body: "A confirmation has been sent to your email. See you there!",
      error_duplicate: "You are already registered for this event.",
      error_full: "Sorry, this event is now full.",
      error_generic: "Something went wrong. Please try again.",
    },
    waiver: {
      title: "WAIVER, RELEASE & INDEMNIFICATION FORM",
      agree_label: "I agree to the above statement",
      content: `In consideration of being permitted to participate in any way in the Momenta sports, recreational, or fitness activities ("Activities"), the undersigned acknowledges, appreciates, and agrees that:

1. RISK OF INJURY: The risk of injury from the Activities is significant, including the potential for permanent disability and death, and while particular rules, equipment, and personal discipline may reduce this risk, the risk of serious injury does exist.

2. RELEASE OF LIABILITY: I HEREBY RELEASE, WAIVE, DISCHARGE AND COVENANT NOT TO SUE Momenta, its affiliates, directors, officers, employees, volunteers, agents, and successors from all liability to the undersigned, their personal representatives, assigns, heirs, and next of kin for any and all claims, demands, losses, damages, rights, and causes of action of any kind whatsoever arising from or related to the Activities.

3. INDEMNIFICATION: The undersigned also expressly agrees to indemnify and hold harmless Momenta and its representatives from any loss, liability, damage, or costs, including court costs and attorneys' fees, that may incur due to the undersigned's participation in the Activities.

4. ASSUMPTION OF RISK: The undersigned expressly acknowledges that the Activities involve risks of serious injury and that they voluntarily assume full responsibility for all risks of loss, property damage, personal injury, or death.

5. MEDICAL CONDITION: I certify that I am physically fit, have sufficiently prepared for participation in the Activities, and have not been advised otherwise by a qualified medical professional.

By signing below, I acknowledge that I have read this Waiver, Release, and Indemnification Agreement, fully understand its terms, and voluntarily agree to be bound by it.`,
    },
    contact: {
      page_title: "Contact Us",
      page_subtitle: "Got a question, suggestion, or want to collaborate? We'd love to hear from you.",
      email_label: "Email",
      location_label: "Location",
      location_value: "Sydney, Australia",
      social_label: "Social",
      response_label: "Response Time",
      response_value: "We typically respond within 24–48 hours.",
      form_name: "Full Name",
      form_name_placeholder: "Your full name",
      form_email: "Email Address",
      form_email_placeholder: "you@example.com",
      form_phone: "Phone Number",
      form_phone_placeholder: "04xx xxx xxx",
      form_inquiry_type: "Inquiry Type",
      form_inquiry_general: "General",
      form_inquiry_booking: "Event Booking",
      form_inquiry_sponsorship: "Sponsorship",
      form_inquiry_other: "Other",
      form_message: "Message",
      form_message_placeholder: "How can we help?",
      form_required: "* Required fields",
      form_submit: "Send Message",
      form_submitting: "Sending...",
      form_success_title: "Message Sent!",
      form_success_body: "Thanks for reaching out. We'll get back to you soon.",
      form_error_generic: "Something went wrong. Please try again.",
    },
  },
  zh: {
    nav: {
      home: "首页",
      events: "活动",
      calendar: "日历",
      gallery: "相册",
      partners: "合作伙伴",
      about: "关于我们",
      contact: "联系我们",
      register: "立即报名",
    },
    hero: {
      cta_events: "查看本周活动",
      cta_join: "加入我们",
    },
    footer: {
      tagline: "悉尼最活跃的华人户外社群。",
      rights: "版权所有。",
    },
    common: {
      back_to_events: "返回活动列表",
      spots_left: (n: number) => `剩余 ${n} 个名额`,
      event_full: "已满",
      free: "免费",
      register_now: "立即报名",
      featured: "精选",
      no_events: "本月暂无活动",
    },
    wechat: {
      login_button: "微信登录",
      logging_in: "正在打开微信…",
      logout: "退出登录",
      logged_in_as: "已登录",
      login_to_register: "使用微信登录以自动填写您的信息",
      skip_login: "不使用微信，直接填写",
    },
    register: {
      title: "报名",
      wechat_name: "微信昵称",
      wechat_name_placeholder: "您的微信显示名称",
      wechat_prefilled: "已从微信自动填写",
      name: "真实姓名",
      name_placeholder: "您的全名",
      age: "年龄",
      age_placeholder: "例：28",
      email: "电子邮箱",
      email_placeholder: "you@example.com",
      phone: "手机号码",
      phone_placeholder: "04xx xxx xxx",
      gender: "性别",
      gender_male: "男",
      gender_female: "女",
      gender_other: "其他",
      gender_prefer_not: "不愿透露",
      notes: "备注",
      notes_placeholder: "饮食要求、运动经验等",
      required: "* 为必填项",
      submit: "确认报名",
      submitting: "报名中…",
      success_title: "报名成功！",
      success_body: "确认邮件已发送至您的邮箱，期待与您相见！",
      error_duplicate: "您已报名参加本次活动。",
      error_full: "抱歉，本次活动名额已满。",
      error_generic: "出现错误，请重试。",
    },
    waiver: {
      title: "免责声明、豁免及赔偿条款",
      agree_label: "我已阅读并同意以上条款",
      content: `参与者在参加 Momenta 组织的任何体育、娱乐或健身活动（以下简称"活动"）时，须阅读并同意以下条款：

1. 受伤风险：参与活动存在重大受伤风险，包括永久性残疾和死亡的可能性。虽然遵守特定规则、使用适当装备和保持个人自律可降低此风险，但严重受伤的风险仍然存在。

2. 责任豁免：本人特此免除、放弃、解除 Momenta 及其关联机构、董事、官员、员工、志愿者、代理人和继承人对本人（其个人代表、受让人、继承人和近亲属）的一切责任，涉及因参与活动而产生的任何索赔、诉求、损失、损害、权利和诉因。

3. 赔偿承诺：本人明确同意，对于因本人参与活动而导致 Momenta 及其代表产生的任何损失、责任、损害或费用（包括诉讼费用和律师费），本人将予以赔偿并使其免受损害。

4. 风险承担：本人明确承认活动存在严重受伤风险，并自愿承担因参与活动可能产生的所有财产损失、人身伤害或死亡风险。

5. 健康状况：本人证明自己身体健康，已为参与活动做好充分准备，且未收到任何具有资质的医疗专业人员的相反建议。

签署本声明即表示本人已阅读并完全理解本免责声明、豁免及赔偿协议的条款，并自愿同意受其约束。`,
    },
    contact: {
      page_title: "联系我们",
      page_subtitle: "有问题、建议或合作意向？欢迎随时联系我们。",
      email_label: "电子邮件",
      location_label: "地址",
      location_value: "澳大利亚，悉尼",
      social_label: "社交媒体",
      response_label: "回复时间",
      response_value: "我们通常在 24–48 小时内回复。",
      form_name: "真实姓名",
      form_name_placeholder: "您的全名",
      form_email: "电子邮箱",
      form_email_placeholder: "you@example.com",
      form_phone: "手机号码",
      form_phone_placeholder: "04xx xxx xxx",
      form_inquiry_type: "咨询类型",
      form_inquiry_general: "一般咨询",
      form_inquiry_booking: "活动预约",
      form_inquiry_sponsorship: "赞助合作",
      form_inquiry_other: "其他",
      form_message: "留言内容",
      form_message_placeholder: "我们能帮您什么？",
      form_required: "* 为必填项",
      form_submit: "发送留言",
      form_submitting: "发送中...",
      form_success_title: "发送成功！",
      form_success_body: "感谢您的留言，我们将尽快与您联系。",
      form_error_generic: "出现错误，请重试。",
    },
  },
} satisfies Record<Locale, unknown>;

export type Translations = typeof translations.en;
