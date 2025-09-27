    import { UserIcon, TrophyIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

    const features = [
    {
        name: 'Play Instantly — No Signup',
        description:
        'Start quizzing in seconds. No email, no password, no friction. Just pure knowledge challenge.',
        icon: UserIcon,
    },
    {
        name: 'Global Leaderboard',
        description:
        'Climb the ranks anonymously. Your score is saved with a guest ID — no personal data required.',
        icon: TrophyIcon,
    },
    {
        name: 'Instant Feedback',
        description:
        'See correct answers immediately after each question. Learn while you play!',
        icon: BoltIcon,
    },
    {
        name: 'Privacy First',
        description:
        'We never collect your name, email, or IP. All scores are stored anonymously and securely.',
        icon: ShieldCheckIcon,
    },
    ]

    export default function FeaturesSection() {
    return (
        <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Why Learn Champ?</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Learn. Play. Compete. Anonymously.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
                A fast, fun, and private way to test your knowledge — no account needed.
            </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-white">
                    <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                        <feature.icon aria-hidden="true" className="h-6 w-6 text-white" />
                    </div>
                    {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-400">{feature.description}</dd>
                </div>
                ))}
            </dl>
            </div>
        </div>
        </div>
    )
    }